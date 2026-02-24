/**
 * Prototype-only: mock credential and proof logic.
 * In production: real ZK circuit (e.g. Circom) and zkVerify API.
 *
 * Stored credential shape (localStorage): { commitment, secret, issuedAt, source }.
 * - secret: used as private input for live-mode proof; never sent to partner.
 * - commitment: derived from secret; public output of circuit in production.
 */

/** Single source of truth for credential storage key. Use getCredential() / getCredentialSecret() instead of reading this key elsewhere. */
export const STORAGE_KEY = 'zk_prototype_credential'
const NULLIFIERS_KEY = 'zk_prototype_nullifiers'

export function hasCredential() {
  return !!localStorage.getItem(STORAGE_KEY)
}

/** Returns parsed credential object or null. Use this instead of raw localStorage + parse. */
export function getCredential() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** Returns the secret field needed for proof submission (live mode). Null if no credential. */
export function getCredentialSecret() {
  const cred = getCredential()
  return cred?.secret ?? null
}

/** Get credential source for display (e.g. 'sms' | 'email'). */
export function getCredentialSource() {
  const payload = getCredential()
  return payload?.source || 'sms'
}

export function clearCredential() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * After verification (phone, email, etc.) we store a mock credential (commitment + secret).
 * Real app: server issues signed credential; we never store phone/email.
 * @param {object} [opts]
 * @param {string} [opts.source] - 'sms' | 'email' (for demo display only)
 */
export function issueMockCredential(opts = {}) {
  const source = opts.source || 'sms'
  const secret = crypto.randomUUID()
  const commitment = 'commit_' + btoa(secret).slice(0, 16)
  const payload = { commitment, secret, issuedAt: Date.now(), source }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}

/**
 * Generate a "proof" (simulated). Real app: ZK proof from circuit.
 */
export function generateMockProof(campaignId) {
  const cred = getCredential()
  if (!cred) return null
  const { commitment, secret } = cred
  const nullifier = 'n_' + btoa(commitment + '|' + campaignId + '|' + secret).slice(0, 24)
  return {
    commitment,
    nullifier,
    campaignId,
    proofPayload: 'mock_zk_proof_' + Date.now(),
  }
}

/**
 * Simulate sending proof to zkVerify and getting valid/invalid.
 */
export function simulateZkVerify(proof) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ valid: true, receipt: 'zkVerify_receipt_' + Date.now() })
    }, 800)
  })
}

/**
 * In prototype we use in-memory nullifiers per session.
 * Real app: backend DB stores nullifiers per campaign.
 */
const usedNullifiers = new Set()

export function isNullifierUsed(nullifier) {
  return usedNullifiers.has(nullifier)
}

export function markNullifierUsed(nullifier) {
  usedNullifiers.add(nullifier)
}
