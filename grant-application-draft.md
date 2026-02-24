# Thrive zkVerify Grant Application Draft (Web2 & Web3)

*Use this draft as the base for your formal application. Replace any example partner or vertical names with your own before submitting; ensure no placeholder text remains in the submitted form.*

---

## Submission-ready one-liner (paste into form)

**One sentence (under 25 words):**  
Plug-and-play Sybil resistance: one integration, privacy-preserving proof-of-human, every verification a ZK proof on zkVerify; no PII stored.

**Alternative (stronger):**  
A composable, on-chain proof-of-human layer: partners get bot-resistant signups without PII; every verification is a ZK proof verified on zkVerify.

---

## 1. Problem & Solution (elevator pitch)

**Problem:** Sybil attacks and bots drain token launches, distort waitlists, and waste spend on airdrops and signups—costing projects millions in polluted data and lost trust. Existing solutions force a choice: easy integration but centralized databases and PII liability, or decentralized but complex infrastructure. There is no universal, privacy-preserving proof-of-human layer that routes verification through a dedicated ZK chain.

**Solution:** We are building the **privacy-preserving proof-of-human gateway** that turns zkVerify into the default verification rail for high-volume, bot-sensitive use cases. Partners integrate once (widget or API); users prove they’re human with one click—no phone or identity ever shared with the partner. Every verification is a ZK proof verified on **zkVerify** and settles on-chain. **Users prove they are human—not who they are.** We are not a one-off dApp; we are the composable identity primitive for zkVerify's ecosystem.

**Differentiation:** We are **verification as a service**, not just ZK infrastructure: partners don't run nodes or manage circuits. We focus on **proof volume and integration simplicity**—bot resistance in minutes, no SMS vendor contracts, no PII liability, no bot-farm exposure. We are not a CAPTCHA and not a centralized database; we are a composable, on-chain proof-of-human layer. We start with SMS/email (lighter than World ID/Orb) for waitlists and mints; World ID is an optional upgrade. We handle credential issuance, proof generation, and zkVerify submission. Our success is zkVerify’s success: every new integration drives blockspace consumption and ecosystem growth.

**Use cases & roadmap:** We start with **proof-of-human** via **SMS** (MVP) and expand to **email** and **World ID** as alternative credential issuers—same gateway, same ZK flow. **Credential portability** (prove on any partner site): MVP validates zkVerify integration on one origin; **Milestone 1 includes wallet-based (or account-based) portable credential** so the gateway is truly cross-site. We roadmap proof-of-knowledge, age/eligibility gating, and private voting. See `docs/use-cases-and-roadmap.md` for the full matrix.

**Partner pitch (one line):** Add bot-resistant signups in minutes: users prove humanity privately; you get a verifiable boolean + optional zkVerify receipt—no phone numbers, no SMS vendor contracts, no PII liability, no bot-farm exposure.

---

## 2. Why zkVerify? (What on-chain verification gives that a REST API doesn't)

**Trust and auditability:** Every verification is a real ZK proof verified on-chain. Partners get **cryptographic certainty** of humanity; the backend cannot fake or forge verification. Proof volume is **publicly auditable**; receipts are **composable** (e.g. for governance, airdrops, cross-site checks). This is not "expensive infrastructure for something a REST API could do"—it is **trust-minimized, composable settlement** for proof-of-human.

**Technical fit:** We design for zkVerify from day one. Proofs are submitted in zkVerify-supported formats (Groth16); we use aggregation and receipts for attestation and optional L1 settlement. That keeps per-proof cost low and lets us scale to 250k+ verifications without hitting cost or throughput limits.

**Ecosystem fit:** Every project that integrates our gateway becomes a direct consumer of zkVerify blockspace. We will report proof volume and unique addresses, surface “Powered by zkVerify” in our product and docs, and position our gateway as the path for high-volume proof-of-human use cases. Our traction is your traction.

---

## 3. Milestone 2 (25k proofs) – how we get there

We will reach 25k proofs in 90 days through a **hybrid** strategy:

- **Partner-led:** We will secure 2–4 pilot integrations (e.g. NFT mint, airdrop platform, AI waitlist) with committed or projected volume that gets us to 25k verifications in the first 90 days. We are in discussions with potential pilot partners and targeting verticals such as Web3 airdrops, NFT mints, and SaaS/AI waitlists.
- **Product-led:** In parallel we will launch a freemium Bot-Free Waitlist widget and list it in Web3 and Product Hunt directories, with a referral loop to de-risk and potentially exceed the target. Our metric is proofs; we are optimized for adoption, not only revenue, in the grant window.

**Volume reality check:** 25k in 90 days ≈ 278 proofs/day; with 2–4 pilots at ~70–140/day each, achievable if partners have active user bases. Conservative: 25k via initial partners; stretch: 100k+ if product-led adoption takes off. 250k in 150 days (~1,667/day) requires broader adoption or more partners—we design for zkVerify aggregation and will monitor tVFY pricing to keep per-proof cost predictable.

This makes the 25k milestone credible and defensible in the application.

---

## 4. Token utility & ecosystem value (Web3 track)

- **Proof credits:** Projects consume “proof credits” (token-gated or subscription) per verification; credits are burned or staked when proofs are submitted to zkVerify, creating clear token demand tied to usage.
- **Issuer staking (optional):** Credential issuers (e.g. phone verification providers) can stake to participate in the network; stakers earn a share of verification revenue or credits, aligning long-term growth with zkVerify volume.
- **Transparency:** Volume and unique addresses are reported on-chain or via attestations so the ecosystem can verify our contribution to zkVerify blockspace.

---

## 5. Case studies / proof points (use 2–3 in the application)

**Volume – Waitlist / SaaS**  
We are in discussions with two AI-focused startups that run large waitlists for beta access. Each integrates our Bot-Free Waitlist widget; every signup generates one proof verified via zkVerify. Conservative projection: 8k–12k verifications from these two partners in the first 90 days, forming the core of our M2 target.

**Volume – Airdrop**  
One Web3 airdrop platform has expressed intent to pilot our proof-of-human gate before token claim. Their typical campaign has 15k–30k claimants. One campaign would deliver 15k+ proofs to zkVerify, demonstrating both volume and a clear “one claim per human” use case verified on-chain.

**Technical validation**  
We implemented a minimal proof flow and submitted test proofs to zkVerify’s Volta testnet. Verification latency was under 5 seconds per proof and compatible with our planned Groth16 circuit. When submitting the application, include a Volta tx hash (or aggregation receipt) as proof of test submission; where available, report proof generation time and verification time separately. This validates our architecture for scaling to 25k and 250k proofs within the grant timeline.

**Before/after (optional)**  
Without proof-of-human, waitlists in our target segment often see ~30–40% bot signups. With our gateway, partners receive verified-only signups and we route 100% of proofs through zkVerify—no identity shared, full auditability via receipts.

---

## 6. Risks & mitigations (address in application)

| Risk | Mitigation |
|------|------------|
| Volume seems optimistic | Hybrid strategy (named pilots + product-led); use “projected” and “in discussions” where appropriate; target 2–4 signed LOIs or pilots. |
| Token utility vague | Define proof credits and usage-based consumption; optional issuer staking. |
| Technical plan thin | Attach or link architecture doc (see `docs/architecture-and-risks.md`) and reference testnet validation (tx hash, latency). |
| Backend centralization | Current MVP: backend submits proofs and enforces nullifiers (simplicity). Roadmap: partners can verify directly on zkVerify chain; nullifier set can move on-chain or to verifiable index. |
| Circuit / security | Production circuit will use Merkle inclusion + Poseidon nullifier; post-MVP we will commission a third-party audit before mainnet. |
| zkVerify dependency | We design proof generation to be verifier-agnostic where possible; zkVerify's aggregation is optimal for our scale; we monitor mainnet launch and fee structure. |
| Regulatory / compliance | We do not store PII; we provide verification proofs only. Partners are responsible for their own compliance (KYC, jurisdiction) for their use case. |
| KYC delay | Start KYC as soon as we decide to apply; mention “KYC in progress” if needed. |

---

## 7. Application checklist

- [ ] Elevator pitch (Section 1) pasted and tailored.
- [ ] “Why zkVerify?” (Section 2) included in application.
- [ ] Milestone 2 strategy (Section 3) with your partner names/verticals.
- [ ] Token utility (Section 4) summarized in Web3 section.
- [ ] At least 2 case studies (Section 5) with “projected”/“expected” where not live.
- [ ] Risks (Section 6) addressed in one short paragraph or table.
- [ ] Technical architecture or testnet results referenced (see `docs/architecture-and-risks.md`).

---

## 8. For Thrive Web2 Program

Use the same product and milestones; adjust wording for Web2. **Full requirements mapping:** see `docs/web2-program-requirements-mapping.md` (Key Requirements, Application requirements, Milestones, and Web2 signup use case).

- **Positioning:** “Web2 applications leveraging zkVerify for efficient zero-knowledge proof verification; traditional app integrations designed for mainstream user adoption without requiring blockchain knowledge.”
- **Value:** “Privacy-preserving authentication for web applications.” Same flow: phone-based credential → one-click prove human → proof verified on zkVerify. **At signup, users can also prove** (without giving PII to the site): that they have a verified email they don't want in the site's DB, and that they are over 18 (roadmap). Emphasize: intuitive UX, no crypto jargon, sustainable proof volume and user adoption.
- **Milestones:** Unchanged: 25k proofs or 250 unique users (90 days); 250k proofs or 2,500 users (150 days).

**Funding ask (Thrive program):** Request **$30,000 USDC**. The program’s milestone split is fixed (we cannot ask for a higher percentage upfront): **10% on approval**, **10% at M1**, **30% at M2**, **50% at M3**. At $30k that gives **$6,000** from approval + M1 ($3k + $3k), so we have runway to push for M2 and M3. Full breakdown: Approval $3k → M1 (live, 45d) $3k → M2 (25k proofs or 250 users, 90d) $9k → M3 (250k or 2,500 users, 150d) $15k. State **$30,000 USDC** and this split in the application form.

---

## 9. Final checks before submit

- [ ] **One-liner** filled in the form (use Section “Submission-ready one-liner” above).
- [ ] **Every form section** mapped to a sentence or paragraph in this draft or in `docs/` / `agents/`.
- [ ] **KYC** acknowledged; will complete as required.
- [ ] **Milestones and amounts** match what you request; no placeholder [X] or [Y] left in the submitted text.
- [ ] **Links** (docs, repo, demo) open and show the right content.
- [ ] **Web2 vs Web3:** If applying Web2, use Section 8 wording; if Web3, keep token utility (Section 4) and “unique addresses” in milestones.
