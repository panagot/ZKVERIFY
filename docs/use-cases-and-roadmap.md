# Use Cases & Roadmap (Beyond SMS)

Our gateway is designed to support **multiple ways** to get a credential and **multiple ZK use cases** on top. SMS is the MVP for proof-of-human; we expand to other issuers and use cases over time.

---

## Part 1: Credential issuers (how users get “verified”)

| Issuer | Flow | When we use it | Status |
|--------|------|----------------|--------|
| **SMS / Phone** | User enters phone → receives code → enters code → we issue credential. We never store phone. | MVP. High reach; good for Web2 and volume. | **Live in prototype; production M1.** |
| **Email** | User enters email → receives one-time magic link (or code) → clicks or enters code → we issue credential. We never store email. | Web2-friendly; lower friction than SMS in some regions; weaker Sybil resistance than phone. | **Roadmap (post-M1).** |
| **World ID / Orb** | User verifies with World ID → we receive attestation → issue credential bound to World ID identity. | Strong Sybil resistance; Web3-native; good for airdrops and DAOs. | **Roadmap (optional tier).** |
| **Social / OAuth** | User signs in with GitHub/Google etc.; we issue time-limited or activity-based credential (e.g. “account age + activity”). | Easy onboarding; weaker anti-bot; good for waitlists and low-stakes gates. | **Roadmap (optional).** |

**Product stance:** We lead with **phone (SMS)** for the grant and M1 because it balances reach, Sybil resistance, and simplicity. We add **email** and **World ID** as alternative issuers so partners can choose “verify with phone,” “verify with email,” or “verify with World ID” without changing their integration. Same credential format and same ZK proof flow; only the issuance step differs.

---

## Part 2: ZK use cases (what the proof proves)

Beyond “I’m human,” we can support other statements that fit zkVerify’s program and our infrastructure:

| Use case | What is proven | Typical flow | Status |
|----------|----------------|--------------|--------|
| **Proof-of-human** | “I am a unique human (or control a unique device).” | Credential from issuer (SMS/email/World ID) → ZK proof → zkVerify. | **Core product; M1.** |
| **Proof-of-knowledge** | “I know the answer to X” without revealing the answer. | Question + commitment to answer; user proves knowledge of preimage; ZK proof → zkVerify. | **Roadmap.** Quizzes, bounties, certifications. |
| **Age / eligibility gate** | “I am over 18” (or “in jurisdiction Y”) without revealing identity. | User has attested age/eligibility elsewhere; we issue scoped credential; ZK proof for “age ≥ 18” or similar. | **Roadmap.** Aligns with zkVerify examples. See [how we would verify age](how-we-would-verify-age.md). |
| **Private voting / polling** | “I am an eligible voter and I cast one vote” without revealing choice or identity. | Eligibility credential + ZK proof per vote; nullifier per poll. | **Roadmap.** DAOs, surveys. |
| **Ownership (Web3)** | “I own asset X” (NFT, token) without exposing wallet or signing. | User proves balance/NFT ownership in ZK; proof → zkVerify. | **Roadmap (Web3 track).** Gated access, airdrops. |

**Product stance:** We **ship proof-of-human first** and drive volume to zkVerify for the grant. We document and roadmap **proof-of-knowledge** and **age/eligibility** as natural extensions (same gateway, different circuit or credential scope). In the application we say: “Our gateway starts with proof-of-human (SMS, then email and World ID); we will extend to proof-of-knowledge and age gating as second-phase use cases.”

---

## Part 3: Roadmap summary (for grant and pitch)

| Phase | Credential issuers | ZK use cases | Goal |
|-------|--------------------|--------------|------|
| **M1 (45 days)** | SMS only | Proof-of-human only | Live deployment, zkVerify integrated, docs published. |
| **M2 (90 days)** | SMS; email in beta if capacity | Proof-of-human | 25k proofs or 250 users; pilot partners. |
| **M3 (150 days)** | SMS; email; World ID optional | Proof-of-human; proof-of-knowledge or age gate in design | 250k proofs or 2.5k users; expand use cases. |
| **Post-grant** | SMS, email, World ID, optional social | Proof-of-human, proof-of-knowledge, age/eligibility, voting, ownership | Sustainable volume; partner pricing; token utility (Web3). |

**Portable credential (prove everywhere):** Today the credential is stored in the browser (one device, one origin), so the user can prove only on that origin. **Milestone 1 includes wallet-based (or account-based) portable credential** so the gateway is truly cross-site—users verify once and prove they’re human on any participating website or app without re-verifying. MVP validates zkVerify integration on one origin; production adds portable credential. See `docs/architecture-and-risks.md` (section “Portable credential”).

---

**Web2 signup (prove at signup without giving PII):** When a user signs up on a Web2 site, they can prove—without revealing to the site—**(1)** that they are human (phone verified), **(2)** that they have a verified email they do not want to store in the site's database, and **(3)** that they meet age requirements (e.g. over 18). The site gets booleans and optional zkVerify receipts; it never gets phone, email, or DOB. This fits "Verify age requirements while maintaining privacy" and "Privacy-preserving authentication for web applications" (zkVerify Web2 examples). See `docs/web2-program-requirements-mapping.md` for full mapping to the Web2 program.

---

## Part 4: Why this improves the project

- **Grant narrative:** We’re not “just an SMS tool.” We’re a **verification gateway** with a clear path to multiple issuers and multiple ZK use cases—all verified on zkVerify. That shows vision and alignment with their listed examples (age, voting, proof-of-knowledge, ownership).
- **Partner pitch:** “Today: proof-of-human via phone. Soon: email and World ID. Later: proof-of-knowledge and age gating with the same integration.” Partners get one SDK and can opt into new use cases as we ship.
- **Technical:** Same backend (proof submission, nullifiers, zkVerify), same aggregation and cost model. New credential issuers and new circuits extend the system without replacing it.

Use this doc in the grant application under “Use cases” or “Roadmap,” and on the website under “Use cases” or “Roadmap.”
