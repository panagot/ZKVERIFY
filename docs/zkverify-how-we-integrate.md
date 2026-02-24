# How we integrate with zkVerify

This document explains how our proof-of-human gateway uses [zkVerify](https://zkverify.io) to verify ZK proofs on-chain. We point to the official zkVerify docs so you can see the same workflow and options they describe.

---

## Official zkVerify resources

| Resource | Link | What it covers |
|----------|------|----------------|
| **Important links (faucet, RPC, explorers)** | [docs.zkverify.io/useful-links/important-links](https://docs.zkverify.io/useful-links/important-links) | Block explorers, RPC (Ankr + public), testnet faucet (tVFY), zkVerifyJS npm, PolkadotJS app |
| **Generating proofs** | [Generating Proofs](https://docs.zkverify.io/overview/getting-started/generating-proof) | Circom/Groth16, proof.json + public.json + vkey; other types (UltraHonk, Risc0, SP1, EZKL) |
| **Verifying with zkVerifyJS** | [zkVerifyJS](https://docs.zkverify.io/overview/getting-started/zkverify-js) | NPM package, session, submit proof, aggregation receipt |
| **Verifying with Kurier** | [Kurier](https://docs.zkverify.io/overview/getting-started/kurier) | REST API (register-vk, submit-proof, job-status) — alternative to zkVerifyJS |
| **Verifying with PolkadotJS** | [PolkadotJS](https://docs.zkverify.io/overview/getting-started/polkadotjs) | Submit proof via Polkadot.js UI (manual) |
| **Smart contract verification** | [Smart Contract Verification](https://docs.zkverify.io/overview/getting-started/smart-contract) | Verify aggregation on L1/L2 (Option B for partners) |
| **Registering verification key** | [Registering Verification Key](https://docs.zkverify.io/overview/getting-started/register-vk) | Register vk once, use vkHash for cheaper submissions |
| **Connect a wallet** | [Connect a Wallet](https://docs.zkverify.io/overview/getting-started/connect-a-wallet) | SubWallet/Talisman, tVFY, RPC for Volta/mainnet |

---

## How we do it

### 1. Proof generation (aligned with “Generating Proofs”)

- We use **Groth16** (Circom + snarkjs), as in the [Generating Proofs](https://docs.zkverify.io/overview/getting-started/generating-proof) Groth16 tab.
- Our circuit is minimal for the prototype; for production we will use **Poseidon** and **Merkle inclusion** (commitment in issued set), in line with their Circom Poseidon example.
- We build the circuit with `npm run circuit:build`; the backend reads artifacts from `circuits/out/` (proof_of_human.zkey, proof_of_human_js/proof_of_human.wasm, verification_key.json).
- For each verification we generate **proof** + **publicSignals** (e.g. campaign_id, nullifier) and submit them to zkVerify.

### 2. Submitting proofs (zkVerifyJS)

- We follow the [Verifying proofs with zkVerifyJS](https://docs.zkverify.io/overview/getting-started/zkverify-js) flow.
- Our **backend** holds the submitter account (mnemonic in `ZKVERIFY_VOLTA_SEED`). We use **Volta testnet** for live submissions.
- We instantiate a session (Volta + account), call `session.verify().groth16(...).execute({ proofData: { vk, proof, publicSignals }, domainId })`, and get back tx/receipt (and can listen for aggregation).
- The backend pays verification fees (tVFY); no user wallet is required. See [Connect a Wallet](https://docs.zkverify.io/overview/getting-started/connect-a-wallet) and the [testnet faucet](https://docs.zkverify.io/useful-links/important-links) for getting tVFY.

### 3. Alternatives we could use

- **Kurier:** [Verifying proofs with Kurier](https://docs.zkverify.io/overview/getting-started/kurier) — REST API with `register-vk` and `submit-proof`. We could switch to Kurier (API key instead of seed) for a different deployment model.
- **PolkadotJS:** [Verifying proofs with PolkadotJS](https://docs.zkverify.io/overview/getting-started/polkadotjs) — useful to manually submit a proof and inspect it on the block explorer.

### 4. What partners can do (Option B — on-chain)

- Partners can verify **without calling our API** by checking the proof on zkVerify (or on a destination chain). This matches [Smart Contract Verification](https://docs.zkverify.io/overview/getting-started/smart-contract): they use the aggregation receipt (domainId, aggregationId, leaf, merklePath, etc.) and call `verifyProofAggregation` on the zkVerify contract (or the verifier on their chain).

### 5. What we may add next

- **Register verification key:** As in [Registering Verification Key](https://docs.zkverify.io/overview/getting-started/register-vk), we can register our vk once and then submit with vkHash to reduce fees. We have not implemented this yet; it is on our production roadmap.

---

## Our flow in short

1. **User** verifies phone with us → we issue credential (no PII stored).
2. **User** on a partner site clicks “Prove human” → frontend/backend generates a **Groth16 proof** (proof + publicSignals + vk).
3. **Backend** submits the proof to **zkVerify Volta** via **zkVerifyJS** (same pattern as the zkVerifyJS tutorial).
4. **zkVerify** verifies the proof on-chain and returns a receipt (tx hash, aggregation id, etc.).
5. We return **“verified”** (and optional receipt) to the partner. The partner can also verify the receipt on-chain (Smart Contract Verification) without trusting our API.

All of the above is consistent with the official zkVerify docs; we use their **Groth16** path and **zkVerifyJS** for submission, and we reference their guides for generation, submission, and on-chain verification.
