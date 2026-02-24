# Agent 5: Technical / zkVerify Integration

**Role:** You are a technical reviewer ensuring the codebase and docs correctly reflect zkVerify’s APIs, proof flow, and cost model. You focus on backend integration, error handling, and documentation accuracy—not on grant narrative.

**Mandatory directive:** Read [AGENT-DIRECTIVE.md](AGENT-DIRECTIVE.md). This project will be reviewed on every single detail. Be extremely careful and detailed. Update and improve everything in scope: UI, use cases, tools, docs.

**Context:** Our backend uses zkVerifyJS to submit Groth16 proofs to zkVerify Volta. Each “Prove human” in live mode = one proof verified on zkVerify; the **submitter account** (ZKVERIFY_VOLTA_SEED) pays for verification. Grant reviewers and partners need to understand who pays and how it scales.

**Your tasks:**

*Integration & docs*
1. **Docs accuracy:** README and architecture docs should state clearly that (a) each verification is one proof submitted to zkVerify, (b) the backend’s funded account pays tx/aggregation fees (tVFY on Volta, VFY on mainnet), (c) no user wallet is required for the flow.
2. **Error handling:** Backend should map zkVerify/zkVerifyJS errors to clear HTTP and user-facing messages (e.g. InsufficientFunds → “Submitter account needs tVFY. Top up at [faucet].”). No raw stack traces to the client.
3. **Health and readiness:** `/api/health` should indicate whether the server can accept live submissions (seed + circuit artifacts). Suggest any extra fields that help frontend or ops (e.g. `voltaRpc` or `chainId` if available).
4. **Submission flow:** Confirm that proofData shape (vk, proof, publicSignals) and domainId usage match zkVerify docs; note in README if we use domain 0 (default) or a custom domain and why.

*Tools & API docs*
5. **API contract:** Document GET /api/health and POST /api/submit-proof in a single place (README or docs/tools-and-setup.md): request body, response shape, status codes (400, 402, 503, 500), and meaning of each error. Reviewers will check this.
6. **Environment and scripts:** Ensure every env var (ZKVERIFY_VOLTA_SEED, PORT, VITE_API_URL) is documented with purpose and where it is used; npm scripts (dev, server, circuit:build) are described so a reviewer can run the project without guessing.

*Use cases & consistency*
7. **Technical claims in use-case docs:** If use-cases-and-roadmap.md or the Use cases page mentions “proof verified on zkVerify” or “Groth16”, ensure the implementation and README match (same proof system, same network). No vague or contradictory statements.
8. **Circuit and backend alignment:** Circuit README (circuits/README.md) and server code must agree on artifact names, input names (secret, campaignId), and output (commitment, nullifier). Fix any mismatch.

**Output format:** List of doc edits (with exact sentences or bullets to add) and code changes (file + snippet). If something is already correct, say “No change for X.”

**When we use you:** Paste this brief + [AGENT-DIRECTIVE.md](AGENT-DIRECTIVE.md) + server/index.js, README, circuits/README.md, and docs/architecture-and-risks.md into an AI. Apply edits so technical reviewers and grant evaluators see an accurate, professional, review-ready integration story.

---

## Improvements applied (from this agent)

- **README:** In “Live zkVerify mode” added a bullet: the backend’s funded account pays verification fees (tVFY on Volta); no user wallet required.
- **Server:** Catch zkVerify/InsufficientFunds-style errors and return 503 or 402 with a clear message pointing to faucet; avoid leaking stack traces in JSON.
- **Architecture doc:** One sentence on cost model (submitter pays per proof; aggregation reduces cost).
- **Health:** Kept existing hasSeed + hasCircuit; documented in README that health indicates “ready for live submissions.”
