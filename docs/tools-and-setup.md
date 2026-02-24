# Tools & setup (for reviewers and developers)

This document describes scripts, environment variables, and the backend API so reviewers can run and verify the project without guessing.

---

## npm scripts

| Script | What it does | Requirements |
|--------|----------------|--------------|
| `npm run dev` | Starts the Vite dev server (frontend). Open http://localhost:5173 | Node 18+, `npm install` |
| `npm run server` | Starts the Node backend (Express). Listens on `PORT` (default 3001) | Node 18+, `npm install`. For live zkVerify: `ZKVERIFY_VOLTA_SEED`, circuit artifacts in `circuits/out/` |
| `npm run circuit:build` | Builds the Circom circuit (r1cs, wasm, sym). Optionally runs Groth16 setup if a ptau file exists | Circom installed; for zkey/vk: snarkjs + ptau file (see [circuits/README.md](../circuits/README.md)) |

**Demo (no backend):** Run only `npm run dev`. Use the app in demo mode (simulated proofs).

**Live zkVerify:** Run `npm run server` in one terminal, then `VITE_API_URL=http://localhost:3001 npm run dev` in another. Ensure `.env` has `ZKVERIFY_VOLTA_SEED` and circuit artifacts are built.

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `ZKVERIFY_VOLTA_SEED` | Backend (`.env`) | Mnemonic for the Volta account that submits proofs. Must hold tVFY (from [faucet](https://docs.zkverify.io/overview/important-links)). |
| `PORT` | Backend (`.env`) | Port the server listens on (default `3001`). |
| `VITE_API_URL` | Frontend (`.env.local` or shell) | Backend base URL. If set, the app uses **live mode** (real proofs to zkVerify). If unset, **demo mode** (simulated). |

See [.env.example](../.env.example) and [.env.example.frontend](../.env.example.frontend).

---

## Backend API

Base URL: `http://localhost:3001` (or your `PORT`).

### GET /api/health

**Response (200):** JSON

- `ok`: boolean
- `mode`: `"zkVerify"` if server can submit real proofs (has seed + circuit artifacts), else `"demo"`
- `hasSeed`: boolean — `ZKVERIFY_VOLTA_SEED` is set
- `hasCircuit`: boolean — `circuits/out/proof_of_human.zkey`, `proof_of_human_js/proof_of_human.wasm`, and `verification_key.json` exist

Use this to confirm the server is ready for live submissions.

---

### POST /api/submit-proof

**Request body (JSON):**

- `secret` (string, required): Credential secret from the client (e.g. from the credential stored in the browser). Length 1–2048.
- `campaignId` (string or number, required): Campaign or session id. Must be a non-negative number (used as circuit public input).

**Success (200):** JSON

- `success`: true
- `txHash`: string (zkVerify transaction hash or "submitted")
- `receipt`: string or null
- `domainId`, `aggregationId`: optional

**Errors:**

- **400** — Missing `secret` or `campaignId`; invalid `secret` (empty or length > 2048); invalid `campaignId` (not a non-negative number); or **nullifier already used** (replay).
- **402** — Submitter account has insufficient funds (needs tVFY). Message includes link to faucet.
- **503** — Server not configured for zkVerify (missing `ZKVERIFY_VOLTA_SEED`) or circuit artifacts missing. Message explains how to fix.
- **500** — Proof generation or zkVerify submission failed. Message is user-friendly; no stack trace.

---

## Toggling demo vs live mode

- **Demo mode:** Do not set `VITE_API_URL`. Run only `npm run dev`. The app simulates credential issuance and proof submission; no backend required.
- **Live mode:** Set `VITE_API_URL` (e.g. `http://localhost:3001`), run the backend with `ZKVERIFY_VOLTA_SEED` and circuit artifacts. The header and hero will show "Live zkVerify · Volta" and proofs are submitted to zkVerify Volta.
