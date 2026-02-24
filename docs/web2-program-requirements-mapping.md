# Web2 Program Requirements — How We Meet Them

This document maps the zkVerify Thrive Web2 program requirements to our proof-of-human gateway so we can answer the application clearly and show fit.

---

## Why Apply (program goals)

| Program goal | How we fit |
|--------------|------------|
| **Funding for proof verification volume** | Every verification is a ZK proof sent to zkVerify; we target 25k proofs (90d) and 250k (150d). Our product *is* proof volume. |
| **Token utility & ecosystem growth** | We consume zkVerify blockspace; our integrations drive ecosystem usage. We report volume and unique users. |
| **Web2 teams, cost-effective, scalable** | We are a Web2-style integration (widget/API, no crypto UX); we use zkVerify aggregation for cost-effective scale; one integration, many verifications. |
| **Groundbreaking ZK applications** | Privacy-preserving proof-of-human at signup: prove human, age, and/or email ownership without giving PII to the site. |

---

## Web2 Program definition

> Web2 applications leveraging zkVerify's infrastructure for efficient zero-knowledge proof verification, featuring **traditional app integrations** designed for **mainstream user adoption** and **sustainable value creation** without requiring blockchain knowledge.

**How we fit:**

- **Traditional app integrations:** Partners add a widget or API; no wallet, no chain jargon. Same as adding a login or CAPTCHA provider.
- **Mainstream adoption:** Users verify once (phone or email); then one-click “prove” on any partner site. No keys, no gas, no “blockchain.”
- **Sustainable value:** Revenue from verification credits / API usage; volume grows with partners (waitlists, signups, airdrops).
- **No blockchain knowledge required:** Users never see “zkVerify” or “proof”; they see “Verify you’re human” and “Verified.”

---

## What We’re Looking For — use cases & examples

| Category / example from program | How we deliver (today or roadmap) |
|---------------------------------|-----------------------------------|
| **Authenticity verification** | Proof-of-human: “this signup is a verified human.” Proof of phone/email ownership without revealing the value. |
| **Confidentiality protection** | We never send PII to partners. User proves “I have a verified phone/email” or “I am over 18” without revealing the underlying data. |
| **Privacy-preserving authentication for web applications** | Core product: authenticate “human” (and optionally age, email) at signup or login without storing phone/email in the partner’s DB. |
| **Verify age requirements while maintaining privacy** | Roadmap: age/eligibility gate — user proves “over 18” (or in jurisdiction) without revealing identity. See “Web2 signup proofs” below. |
| **Prove voter eligibility without revealing identity** | Same primitive: eligibility credential + ZK proof; roadmap for voting/polling. |
| **Establish ownership without granting asset access** | Conceptual fit: “I own a verified credential” without giving the credential or PII to the site. |

---

## Sign up & Sign in with ZK proof (no email, no phone in the database)

**Full flow and what Site B stores:** See [docs/sign-up-sign-in-with-zk-proof.md](sign-up-sign-in-with-zk-proof.md) — user registers with "Sign up with ZK proof"; Site B stores only a ZK-derived identity (e.g. `zk_identifier: 0xAb...Xy`) and verified flags; no email, no cellphone in the DB. When the user returns, "Sign in with ZK proof" matches the proof to that account.

**Scenario (short):** A user signs up on a Web2 website. The site wants assurance that the user is real, is over 18, and has a verified email — but the user does **not** want to hand their email or phone to the site’s database.

**What we enable (today + roadmap):**

| Proof | What the user proves | What the site gets | What the site never gets |
|-------|----------------------|--------------------|---------------------------|
| **Proof-of-human (phone)** | “I have a phone that was verified by the gateway.” | Boolean: verified human; optional zkVerify receipt. | Phone number, any PII. |
| **Proof of email ownership** (roadmap) | “I control an email that was verified by the gateway.” | Boolean: has verified email. | The actual email address. |
| **Age / eligibility** (roadmap) | “I am over 18” (or “in jurisdiction Y”). | Boolean: meets age/eligibility. | Identity, DOB, or other PII. |

**Flow in practice:**

1. User signs up on **Partner Site**. Instead of “Enter your email” and “Enter your phone,” the site shows: “Prove you’re human,” “Prove you have a verified email (optional),” “Prove you’re 18+ (optional).”
2. For each, the user interacts with **our gateway** (or a portable credential): one click or redirect; we generate the ZK proof and submit to zkVerify.
3. Partner receives **verified** (and optional receipt) for each claim. No email, no phone, no DOB stored in the partner’s database.
4. **Mainstream UX:** User never sees “ZK” or “blockchain”; they see “Verify with phone” once, then “Prove” on each site.

This matches the program’s examples: *“Verify age requirements while maintaining privacy”* and *“Privacy-preserving authentication for web applications.”* We deliver proof-of-human today and roadmap **email ownership** and **age/eligibility** on the same gateway and zkVerify pipeline.

---

## Key Requirements — how we meet each

| Requirement | Our response |
|-------------|--------------|
| **zkVerify Integration** | Clear plan: Groth16 proofs, zkVerifyJS submission to Volta (then mainnet). Docs: `docs/zkverify-how-we-integrate.md`, `docs/architecture-and-risks.md`. We have submitted test proofs to Volta. |
| **Technical Excellence** | Robust ZK: Circom circuit, snarkjs, production path Merkle + Poseidon nullifier; backend submits to zkVerify; nullifier prevents replay. Verification requirements documented; Option B for partners (verify on-chain). |
| **User Experience Focus** | Built for mainstream: no wallet required for basic flow; “Verify once, prove everywhere” (with portable credential); one-click prove on partner sites; we abstract ZK and chain entirely. |
| **Sustainable Growth** | Strategy to 25k then 250k proofs: pilot partners (waitlists, airdrops, signups) + product-led widget; revenue from verification credits/API; roadmap email + World ID for more volume. |
| **Performance Tracking** | We can measure and report: verifications per partner, proofs sent to zkVerify, unique users (by nullifier/campaign), API calls. Metrics feed milestone reporting (25k / 250 users, then 250k / 2,500 users). |
| **KYC Compliance** | We will complete KYC verification as required by the program. |
| **Quality Standards** | Technically sound: architecture doc, testnet validation, production circuit plan (Merkle + Poseidon, audit roadmap). Scalable: aggregation, backend pays fees, no per-user wallet. |

---

## Application requirements (10% at approval)

| Requirement | Where we provide it |
|-------------|---------------------|
| **Detailed technical plan (ZK integrated and verified using zkVerify)** | `docs/architecture-and-risks.md`, `docs/zkverify-how-we-integrate.md`; application narrative. |
| **ZK-focused user experience design** | “How it works” page, Get Verified / Prove Human flows; mainstream wording, no crypto jargon. |
| **Ecosystem value proposition** | Composable proof-of-human layer; every integration drives zkVerify volume; partners get bot resistance without PII. |
| **Business plan (revenue, sustainability beyond grant)** | Verification credits / API pricing; pilot partners and product-led adoption; roadmap to multiple issuers and use cases. |

---

## Milestone structure — our mapping

| Milestone | Program | Our plan |
|-----------|---------|----------|
| **Approval (10%)** | Application requirements above. | Submit with technical plan, UX description, ecosystem value, business plan; KYC complete. |
| **M1: Live Deployment (10%) – 45 days** | Production deployment, fully functional zkVerify integration, beta testing, published docs. | Production deployment with zkVerify (Volta then mainnet); beta with pilot partners; docs: integration guide, architecture, zkVerify how-we-integrate. |
| **M2: Initial Traction (30%) – 90 days** | 25,000+ ZK proofs to zkVerify **or** 250+ unique users. | Hybrid: 2–4 pilot partners + Bot-Free Waitlist widget; target 25k proofs or 250 unique users; report metrics. |
| **M3: Scale (50%) – 150 days** | 250,000+ ZK proofs **or** 2,500+ unique users. | Scale via same channels + additional partners and use cases; target 250k proofs or 2,500 users; report metrics. |

We will report **proof volume** (proofs sent to zkVerify) and **unique users** (e.g. unique nullifiers per campaign or global) so the program can verify milestone achievement.

---

## Summary

- We are a **Web2-native** proof verification layer: traditional integration, mainstream UX, no blockchain knowledge required.
- We deliver **authenticity** (proof-of-human), **confidentiality** (no PII to partners), and **privacy-preserving authentication** at signup; we roadmap **age** and **email ownership** proofs on the same stack.
- We meet **Key Requirements** (zkVerify integration, technical excellence, UX, growth, tracking, KYC, quality) and map cleanly to **Application** and **Milestone** structure.
- **Web2 signup** use case: users can prove they’re human, have a verified email (without revealing it), and are over 18 — all via ZK, no PII in the partner’s database.

Use this doc when filling the Web2 application form and when explaining “what we’re looking for” alignment to reviewers.
