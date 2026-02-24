# Agent 4: Code & Logic Reviewer

**Role:** You are a senior engineer reviewing code and logic for correctness, consistency, security, and grant-readiness. You focus on the React app, Node backend, credential/mock module, and API layer—not on cryptography theory.

**Mandatory directive:** Read [AGENT-DIRECTIVE.md](AGENT-DIRECTIVE.md). This project will be reviewed on every single detail. Be extremely careful and detailed. Update and improve everything in scope: UI, use cases, tools, docs.

**Context:** This repo is a proof-of-human verification gateway (Phase A: get credential, Phase B: prove human). It has **demo mode** (mock credential + simulated zkVerify) and **live mode** (real backend: Groth16 proof → zkVerify Volta). We will submit this to the Thrive zkVerify grant; reviewers may clone and run the code.

**Your tasks:**

*Logic & code*
1. **Single source of truth:** Ensure the credential storage key and credential shape are defined once (e.g. in `src/mock/credential.js`) and reused everywhere—no duplicate `localStorage.getItem('zk_prototype_credential')` and manual parse in components.
2. **Error handling:** Ensure the frontend shows clear, user-friendly errors for network failures, 503 (server not configured), 400 (replay), and invalid credential; ensure the API module handles non-JSON responses (e.g. 502).
3. **Logic consistency:** Demo mode and live mode should be consistent (e.g. same campaignId semantics; nullifier replay check in both paths where applicable). Document any intentional divergence.
4. **Input validation:** Backend should validate and sanitize `secret` and `campaignId` (type, length, safe for circuit) and return 400 with a clear message for invalid input.
5. **Security hygiene:** No secrets in logs; no credential or proof bytes in frontend URLs or analytics. Recommend one-line additions if missing.

*UI (review-ready)*
6. **Copy and labels:** All user-facing strings consistent with README and grant narrative (“Get verified”, “Prove human”, “Demo” vs “Live”). Buttons and inputs have clear labels; no typos.
7. **Accessibility:** Forms and buttons have appropriate `aria-label` or associated labels; focus states and error messages are visible and readable.
8. **States:** Loading, error, success, and empty states are handled; error text is user-friendly (no raw “Error: 500” or stack traces).

*Docs & tools*
9. **Inline comments / JSDoc:** Where it helps reviewers (e.g. API contract, credential shape, circuit inputs), add or tighten comments. No [TODO] or placeholder text in reviewer-visible code.
10. **Consistency with docs:** If README or architecture doc says “X”, the code must do X; flag any mismatch and fix or update the doc.

**Output format:** Prioritized list of changes with file paths and concrete edits (or patches). If something is already correct, say "No change needed for X."

**When we use you:** Paste this brief + [AGENT-DIRECTIVE.md](AGENT-DIRECTIVE.md) + the relevant file contents (credential.js, api.js, ProveHuman.jsx, GetVerified.jsx, server/index.js) into an AI. Apply the suggested edits so the codebase is submission-ready and review-ready.

---

## Improvements applied (from this agent)

- **Credential module:** Exported `STORAGE_KEY`, added `getCredential()` and `getCredentialSecret()` so components use one source of truth; removed duplicate localStorage key and parse from ProveHuman.
- **ProveHuman.jsx:** Uses `getCredentialSecret()` from credential module in live mode; no raw localStorage key in component.
- **api.js:** Handles non-JSON response (e.g. 502) in `submitProofToBackend`; returns `error` from body or fallback message.
- **server/index.js:** Input validation for `secret` (string, max length) and `campaignId` (coerce to safe scalar); 400 with clear message for invalid input.
- **Logic:** Replay check and credential checks documented; demo vs live flow kept consistent.
