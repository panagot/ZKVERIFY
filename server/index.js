/**
 * Backend for proof-of-human: generates Groth16 proofs and submits them to zkVerify Volta testnet.
 *
 * Requires: ZKVERIFY_VOLTA_SEED (mnemonic for funded Volta account), and circuit artifacts from
 * npm run circuit:build (proof_of_human.zkey, proof_of_human_js/proof_of_human.wasm, verification_key.json).
 *
 * API:
 *   GET  /api/health       -> { ok, mode: 'zkVerify'|'demo', hasSeed, hasCircuit }
 *   POST /api/submit-proof -> body: { secret: string, campaignId: string|number }
 *        -> 200 { success, txHash, receipt?, domainId?, aggregationId? }
 *        -> 400 missing/invalid input or nullifier replay
 *        -> 402 insufficient funds (submitter needs tVFY)
 *        -> 503 server not configured or circuit missing
 *        -> 500 proof generation or zkVerify submission failed
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createHash } from 'crypto'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const BN254_ORDER = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617')
function stringToField(s) {
  const hex = createHash('sha256').update(String(s)).digest('hex')
  return BigInt('0x' + hex) % BN254_ORDER
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const circuitsOut = join(root, 'circuits', 'out')

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

const usedNullifiers = new Set()

function loadJson(path) {
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

app.get('/api/health', (req, res) => {
  const hasSeed = !!process.env.ZKVERIFY_VOLTA_SEED
  const hasCircuit = existsSync(join(circuitsOut, 'proof_of_human.zkey')) &&
    existsSync(join(circuitsOut, 'proof_of_human_js', 'proof_of_human.wasm')) &&
    existsSync(join(circuitsOut, 'verification_key.json'))
  res.json({
    ok: true,
    mode: hasSeed && hasCircuit ? 'zkVerify' : 'demo',
    hasSeed,
    hasCircuit
  })
})

function safeBigInt(val) {
  if (val == null) return null
  try {
    const n = BigInt(val)
    if (n < 0) return null
    return n
  } catch {
    return null
  }
}

app.post('/api/submit-proof', async (req, res) => {
  const { secret, campaignId } = req.body || {}
  if (secret == null || campaignId == null) {
    return res.status(400).json({ success: false, error: 'Missing secret or campaignId' })
  }
  const secretStr = String(secret).trim()
  if (secretStr.length === 0 || secretStr.length > 2048) {
    return res.status(400).json({ success: false, error: 'Invalid secret (length 1–2048)' })
  }
  const campaignIdBig = safeBigInt(campaignId)
  if (campaignIdBig == null) {
    return res.status(400).json({ success: false, error: 'Invalid campaignId (must be a non-negative number)' })
  }

  const seed = process.env.ZKVERIFY_VOLTA_SEED
  if (!seed) {
    return res.status(503).json({
      success: false,
      error: 'Server not configured for zkVerify. Set ZKVERIFY_VOLTA_SEED.'
    })
  }

  const zkeyPath = join(circuitsOut, 'proof_of_human.zkey')
  const wasmPath = join(circuitsOut, 'proof_of_human_js', 'proof_of_human.wasm')
  const vkPath = join(circuitsOut, 'verification_key.json')
  if (!existsSync(zkeyPath) || !existsSync(wasmPath) || !existsSync(vkPath)) {
    return res.status(503).json({
      success: false,
      error: 'Circuit artifacts missing. Run: npm run circuit:build (and add a ptau file). See circuits/README.md'
    })
  }

  try {
    const snarkjs = await import('snarkjs')
    const vk = loadJson(vkPath)

    const input = {
      secret: stringToField(secretStr),
      campaignId: campaignIdBig
    }
    const nullifierKey = `${secretStr}-${String(campaignId)}`
    if (usedNullifiers.has(nullifierKey)) {
      return res.status(400).json({ success: false, error: 'Nullifier already used (replay)' })
    }

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath)
    usedNullifiers.add(nullifierKey)

    const { zkVerifySession, Library, CurveType } = await import('zkverifyjs')

    const session = await zkVerifySession.start()
      .Volta()
      .withAccount(seed)

    const { transactionResult } = await session
      .verify()
      .groth16({ library: Library.snarkjs, curve: CurveType.bn254 })
      .execute({
        proofData: { vk, proof, publicSignals },
        domainId: 0
      })

    const txInfo = await transactionResult
    await session.close()

    res.json({
      success: true,
      txHash: txInfo?.txHash || txInfo?.blockHash || 'submitted',
      receipt: txInfo?.statement != null ? `statement: ${txInfo.statement}` : null,
      domainId: txInfo?.domainId,
      aggregationId: txInfo?.aggregationId
    })
  } catch (err) {
    console.error('submit-proof error:', err)
    const msg = err.message || ''
    const insufficientFunds = /insufficient|InsufficientFunds|funds|balance/i.test(msg)
    const status = insufficientFunds ? 402 : 500
    const userMsg = insufficientFunds
      ? 'Submitter account needs tVFY. Top up at https://docs.zkverify.io/overview/important-links'
      : (err.message || 'Proof generation or zkVerify submission failed')
    res.status(status).json({
      success: false,
      error: userMsg
    })
  }
})

const PORT = Number(process.env.PORT) || 3001
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log('  GET  /api/health');
  console.log('  POST /api/submit-proof { secret, campaignId }')
})
