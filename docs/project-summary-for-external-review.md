# Project Summary for External Review (ChatGPT / Grok)

*Use this document to get opinions from ChatGPT, Grok, or other reviewers. It describes what we built, what grant programs and partners ask for, and the main challenges.*

---

## 1. What we built so far

We built a **proof-of-human verification gateway** that uses **zero-knowledge (ZK) proofs** so users can prove they are human (e.g. passed phone verification) without revealing their phone number or any PII to the sites that need the proof.

### Product in one sentence

One integration gives partners (waitlists, airdrops, signups) **bot-resistant verification**; every verification is a **ZK proof** verified on **zkVerify** (a dedicated ZK verification chain). Partners get “verified” and optional on-chain receipts; they never see the user’s phone or credential.

### Technical flow (two phases)

- **Phase A — Get verified:** User verifies via phone (or email in roadmap). Our backend checks the code, then **discards** the phone and never stores it. We issue an **anonymous credential** (commitment + a secret only the user/client holds). In the current prototype this credential is stored in the **browser’s localStorage** only.
- **Phase B — Prove human:** On a partner site (or our own demo page), the user clicks “Prove human.” The app uses the credential to generate a **Groth16 ZK proof** that says: “I know a secret that matches a valid credential; here is my nullifier for this campaign.” The proof is sent to **our backend**; the backend submits it to **zkVerify** (Volta testnet today). zkVerify verifies the proof on-chain and returns a receipt. Our backend checks a **nullifier database** (one use per credential per campaign — replay protection) and returns to the partner: **“verified”** and optionally the receipt. The partner never receives the phone number, the credential, or the secret.

### What is implemented

- **Frontend:** React/Vite app with “Get verified” (phone/email simulated with fixed code `30322`) and “Prove human” (join waitlist). Credential stored in localStorage. Demo mode (no backend, simulated proof) and Live mode (calls backend for real proof submission).
- **Backend:** Node/Express server that accepts `POST /api/submit-proof` with `{ secret, campaignId }`, generates a Groth16 proof using snarkjs and a minimal Circom circuit, submits to zkVerify via zkVerifyJS, and returns tx hash and receipt. Replay protection via in-memory nullifier set (per campaign). Health endpoint reports whether the server is configured for live zkVerify (seed + circuit artifacts).
- **Circuit:** Minimal Circom circuit: proves knowledge of `secret`; public inputs/outputs include `campaignId` and nullifier. Intended to be replaced with a proper commitment + nullifier design (e.g. Poseidon hashes, Merkle inclusion) for production.
- **Docs:** Architecture and risks (commitment/nullifier pattern, portable credential, “Site B” flow, wallet vs account vs receipt, API vs on-chain verification), use cases and roadmap (SMS → email → World ID; proof-of-human → proof-of-knowledge, age gate, voting), grant application draft, tools and setup for reviewers.

### Current limitation (credential portability)

The credential lives **only in the browser** where the user got verified. So today the user can “prove human” only on the **same origin** (same site). If they go to **another website** that wants proof-of-human, that site has no access to the credential. We have **designed** (and documented) three ways to make the credential portable later: (1) **wallet-held credential**, (2) **account/backend-held credential** (redirect flow), (3) **receipt-only** (user presents an on-chain receipt to the other site). We have not implemented portable credential yet; it’s on the roadmap.

### Privacy / “Will the other site know by wallet?”

We documented this explicitly:

- If we use a **wallet-based** flow: the other site will see the user’s **wallet address** (because they connect wallet to trigger the proof). The site does **not** see the phone or credential — only “this wallet is verified.”
- If we use **account/redirect** or **receipt-only**: the other site can get “verified” **without** ever seeing the user’s wallet; they only get a session token or a receipt (and in our current design the proof is submitted by our backend, so the receipt doesn’t expose the user’s wallet).

So we can offer both: wallet flow for “one wallet = one human” (e.g. airdrops) and account/receipt flow for “verified session” without revealing wallet.

---

## 2. What “they” ask (grants and partners)

### Grant program (e.g. Thrive / zkVerify ecosystem)

- **Problem/solution:** Clear elevator pitch: Sybil/bots hurt waitlists and airdrops; we provide a privacy-preserving proof-of-human layer with every verification as a ZK proof on zkVerify.
- **Why zkVerify:** Technical fit (Groth16, aggregation, receipts); ecosystem fit (we drive blockspace usage; “Powered by zkVerify”).
- **Milestones:** e.g. 25k proofs (or 250 unique users) by day 90; 250k proofs (or 2.5k users) by day 150. They want a credible path to volume.
- **How we get there:** Partner-led (2–4 pilot integrations: waitlists, airdrops, NFT mints) + product-led (Bot-Free Waitlist widget, directories, referral). Case studies can be “in discussions” or “projected.”
- **Token utility (Web3 track):** Proof credits consumed per verification; optional issuer staking; transparency (volume/addresses on-chain or attestations).
- **Risks:** Volume optimism, technical depth, token utility clarity. We address with hybrid strategy, architecture doc, testnet validation, and clear credit/staking narrative.
- **Technical validation:** We implemented a minimal flow and submitted test proofs to zkVerify Volta; verification latency and format are compatible with our plan. We reference architecture, commitment/nullifier pattern, and circuit design in the application.

### Partners (sites that integrate us)

- **What they want:** Bot-resistant signups or waitlists (or airdrop “one claim per human”) without running their own SMS flow and without storing users’ phone numbers.
- **What they get:** A boolean “verified” and optionally an on-chain receipt. They can verify either via **our API/widget** or by **reading zkVerify’s chain** (user presents receipt + public inputs; partner checks chain and nullifier).
- **What they never get:** The user’s phone number, the credential, or (if we use account/receipt flow) necessarily the user’s wallet.

---

## 3. Main challenges

1. **Credential portability (“prove on another site”)**  
   Today the credential is browser-only. To let users prove on **any** partner site without re-verifying, we need wallet-held, account-held, or receipt-based portability. We have designed and documented the options (and the wallet-privacy tradeoff); implementation is post-MVP.

2. **Wallet vs anonymity on the other site**  
   If the credential is in the wallet and the partner site requires “connect wallet” to prove, the partner **learns the wallet address**. So we have to be clear: ZK hides **phone and credential**; it does not by itself hide **wallet** in a wallet-based flow. We document the alternative flows (account/redirect, receipt-only) where the partner does not see the wallet.

3. **Volume and traction**  
   Grant milestones (25k / 250k proofs) depend on pilot partners and product-led adoption. We state “in discussions” and “projected” for some case studies. Risk: volume is optimistic. Mitigation: hybrid strategy, clear deliverables, and technical validation already done.

4. **Circuit and security**  
   Current circuit is minimal (placeholder). Production needs proper commitment (e.g. Merkle inclusion of issued commitments) and nullifier derivation (e.g. Poseidon, campaign-scoped) so that (a) server never stores phone, (b) one credential = one use per campaign, (c) no linkage across campaigns. Design is in the architecture doc; implementation is part of production hardening.

5. **Cost and scale**  
   Each verification = one proof submitted to zkVerify; our **backend** pays verification fees (tVFY on Volta). We rely on zkVerify’s aggregation/batching for cost and throughput. At 250k proofs we need to confirm pricing and rate limits.

6. **Phone verification abuse**  
   Users could use multiple phone numbers to get multiple credentials. Mitigations: rate limits, optional CAPTCHA, monitoring; long-term optional World ID or stronger attestation.

7. **Grant application clarity**  
   We have to present a clear narrative: problem, solution, why zkVerify, how we hit milestones, token utility (if Web3), risks and mitigations, and technical validation. We have a draft and docs; the ask is to get external eyes (e.g. ChatGPT, Grok) on whether the narrative is compelling and the challenges are addressed convincingly.

---

## 4. What we want from your review (ChatGPT / Grok)

- **Narrative:** Is the problem/solution clear and compelling for a grant committee and for partners? Any gaps or red flags?
- **Challenges:** Are the main challenges (portability, wallet vs anonymity, volume, circuit, cost, abuse) correctly identified? Any other critical risks or objections we should address?
- **Positioning:** For a “proof-of-human verification gateway” that sends every verification through zkVerify: is the differentiation (integration simplicity, proof volume, privacy) clear? Any suggested wording for grant or partner pitch?
- **Technical:** Is the two-phase flow (issuance without storing PII, proof per campaign with nullifier, backend submits to zkVerify) coherent and believable at scale? Any caveats we should state explicitly?

---

*End of summary. All technical details can be found in the repo: `docs/architecture-and-risks.md`, `docs/use-cases-and-roadmap.md`, `grant-application-draft.md`, `README.md`.*

**After review:** We sent this summary to Grok, Deep Seek, and ChatGPT. A synthesis of their feedback and the changes we applied is in **`docs/reviewer-feedback-synthesis.md`**.
