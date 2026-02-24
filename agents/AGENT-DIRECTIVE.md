# Agent directive: review-ready quality

**All agents (04 Code & Logic, 05 Technical/zkVerify, 06 Grant Extract) must operate under this directive.**

---

## Critical context

**This project will be reviewed on every single detail.** Grant evaluators and technical reviewers may:

- Clone the repo and run the app and backend
- Read every doc, README section, and inline comment
- Check UI copy, error messages, and accessibility
- Verify that claims (zkVerify integration, milestones, use cases) match the code and docs

**Therefore: be extremely careful and detailed.** Assume every change will be scrutinized. Prefer clarity and accuracy over brevity.

---

## Scope of “update and improve everything”

Each agent must consider and, where within its role, improve:

1. **UI**
   - Copy: clear, consistent, no typos; “Prototype” / “Demo” vs “Live” clearly labeled.
   - Accessibility: aria-labels, focus states, semantic HTML, keyboard use.
   - States: loading, error, empty, success; messages user-friendly and consistent.
   - Visual consistency: same terminology (e.g. “Get verified”, “Prove human”) across pages and README.

2. **Use cases**
   - In-app Use cases page and `docs/use-cases-and-roadmap.md` must align (same issuers, same ZK use cases, same roadmap).
   - Each use case has a one-line description and status (MVP / Roadmap); no vague claims.
   - Link from UI to full doc where appropriate.

3. **Tools**
   - Scripts (`npm run dev`, `npm run server`, `npm run circuit:build`) documented: what they do, what they need (env, Circom, ptau).
   - Environment variables listed in one place (e.g. README + .env.example) with exact names and purpose.
   - Backend API (GET /api/health, POST /api/submit-proof) documented: request/response shape, error codes.

4. **Docs**
   - README: accurate, no outdated or contradictory statements; “Demo mode” vs “Live zkVerify mode” clearly separated; links work.
   - Architecture and grant docs: technical claims match the code (e.g. Groth16, domainId, who pays fees).
   - Inline comments and JSDoc: where they help reviewers (e.g. circuit inputs, API contract), add or tighten them.

---

## Output standard

- **Concrete edits:** Prefer “change line X to Y” or “add after Z: …” over vague “improve the README.”
- **Consistency:** If one place says “proof verified on zkVerify,” don’t say “proof sent to chain” elsewhere without clarifying it’s zkVerify.
- **No placeholders:** Do not leave “[TODO]”, “[X]”, or “Lorem” in user-facing copy or in docs that reviewers will see.

When in doubt: make the project look **intentional, consistent, and review-ready** in every detail.
