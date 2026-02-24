# Roundtable 1: Copy, UX & Grant Messaging

**Agent focus:** Copy clarity, consistency, grant-aligned wording (privacy-preserving, Sign in with ZK proof, no PII, zkVerify). Reviewer discoverability and demo code 30322.

---

## What changed

### App.jsx (Home)
- **"For reviewers" discoverability:** Section heading updated from "Try the full flow (reviewers)" to **"For reviewers: try the full flow"** so reviewers can find it quickly when scanning.
- **How it works card:** Wrapped reviewer cue in bold: **"For reviewers:"** before "follow the flow and try both paths" for consistency and scannability.
- *Unchanged:* Site A example (email, age, cellphone), "What we store" / "What Site B stores" boxes, hero copy, CTAs, and footer tagline.

### GetVerified.jsx
- **Demo code 30322 visibility:** Added a **"For reviewers:"** line at the top of the verification card (under "Verify with") stating that demo code **30322** completes verification, so reviewers see it before starting.
- **Step labels:** Clarified step 1 to **"Step 1 of 4: Enter your phone or email"** and step 3 to **"Step 3 of 4: Enter verification code"** for consistency with the flow steps.
- **For reviewers toggle:** Button text tightened to **"For reviewers: how credential storage works (localStorage)"** for clarity.
- *Unchanged:* "What we store in our database" box, method tabs (Phone/Email), and success-state copy.

### ProveHuman.jsx
- **Error messages:** Replaced "Phase A" with **"Get verified"** and added **demo code 30322** in all three error strings so users know exactly where to go and what code to use.
- **For reviewers note:** Prefixed with **"Get verified first (demo code 30322), then here click…"** so the reviewer path and code are in one place.
- *Unchanged:* "What Site B stores (no PII)" card, Sign in with ZK proof CTA, and flow steps.

### Workflow.jsx
- **For reviewers:** "Try it yourself" heading changed to **"For reviewers: try it yourself"** so the reviewer CTA is easy to find.
- **Copy trim:** Removed redundant "Clear path for reviewers" from the paragraph (heading now carries that).
- *Unchanged:* Flow diagram, step-by-step timeline, "For reviewers: how localStorage is used on Site B", and demo code 30322 in the body copy.

### UseCases.jsx
- **No edits.** Copy was already consistent (privacy-preserving, no PII, zkVerify, grant messaging). Site A example and "What we store" are not on this page; no structural changes needed.

---

## Why

- **Grant alignment:** Kept and reinforced "privacy-preserving," "Sign in with ZK proof," "no PII," and "zkVerify" across pages; avoided removing or diluting them.
- **Reviewer experience:** "For reviewers" appears at the start of relevant headings/sections so reviewers can quickly find instructions and the demo code **30322** in multiple places (Home, Get verified, Prove human, Workflow).
- **CTAs and steps:** Step labels and error messages now point clearly to "Get verified" and the demo code, reducing confusion and supporting a smooth demo flow.
