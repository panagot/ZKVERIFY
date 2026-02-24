# Proof-of-Human Circuit

Minimal Circom circuit used to generate Groth16 proofs for zkVerify. The circuit proves knowledge of a `secret` and binds a `nullifier` to `campaignId` so each credential can be used once per campaign.

## Circuit

- **File:** `proof_of_human.circom`
- **Private input:** `secret` (field element)
- **Public input:** `campaignId`
- **Outputs:** `commitment = secret`, `nullifier = secret + campaignId` (minimal; production would use Poseidon hash)

## Build (optional)

You need [Circom](https://docs.circom.io/getting-started/installation/) installed. Then:

```bash
# From repo root
mkdir -p circuits/out
circom circuits/proof_of_human.circom --r1cs --wasm --sym -o circuits/out
```

This produces `circuits/out/proof_of_human.r1cs`, `circuits/out/proof_of_human_js/` (WASM + witness generator), and `proof_of_human.sym`.

## Trusted setup (Groth16)

Use [snarkjs](https://github.com/iden3/snarkjs) to generate the proving key and verification key:

```bash
cd circuits/out
npx snarkjs groth16 setup proof_of_human.r1cs ../../ptau/pot12_final.ptau proof_of_human.zkey
npx snarkjs zkey export verificationkey proof_of_human.zkey verification_key.json
```

You need a Powers of Tau file (e.g. `pot12_final.ptau`). For testing you can use a small one from the [snarkjs repo](https://github.com/iden3/snarkjs#7-prepare-phase-2) or run a minimal ceremony.

## Backend

The Node backend expects either:

- Pre-built artifacts in `circuits/out/`: `proof_of_human_js/` (WASM + generate_witness.js), `proof_of_human.zkey`, `verification_key.json`, or
- Environment or script that builds them when you run `npm run circuit:build`.

If artifacts are missing, the backend returns **503** for `POST /api/submit-proof` with a message to run `npm run circuit:build` (and add a ptau file for zkey). See [docs/tools-and-setup.md](../docs/tools-and-setup.md) for the full API.
