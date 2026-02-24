# Case Studies Guide for zkVerify Grant Application

Case studies make your traction and impact concrete. Use them in the application to show you can hit 25k (then 250k) proofs and that partners/users benefit.

**Where to use them (Grant Strategist recommendation):**  
- **Traction / Milestone 2:** Lead with one volume case study (waitlist or airdrop) so reviewers see how you reach 25k proofs.  
- **Technical credibility:** Add one technical validation paragraph (testnet, latency, proof format).  
- **Optional:** One before/after or partner quote in the “Why us” or “Impact” section.

---

## Types of case studies that help

1. **Pilot / projected pilot** – “We will onboard 2–4 pilot partners (e.g. NFT mint, airdrop platform, AI waitlist) with combined projected volume of 25k+ verifications in the first 90 days.” Name verticals or partner types even if not signed yet.
2. **Use-case vignette** – “A Web3 airdrop project needs one-claim-per-human. With our integration they add a single widget; each claim generates one proof to zkVerify. At 10k participants that’s 10k proofs in one campaign.”
3. **Technical proof point** – “We ran a testnet deployment with zkVerify: X proofs verified in Y seconds at Z cost per proof.” Use Volta testnet or staging if available.
4. **Before/after (even hypothetical)** – “Without proof-of-human, waitlist X had ~40% bot signups. With our gateway, partners see verified-only signups and we route 100% of proofs through zkVerify.”

---

## What to include in each case study (short)

- **Who:** Partner type or user segment (e.g. “NFT project,” “DAO voting tool,” “AI startup waitlist”).
- **Problem:** What they need (bot resistance, one-per-human, privacy-preserving).
- **Solution:** Our product (widget/API, proof-of-human, zkVerify verification).
- **Outcome:** Volume (proofs, unique users) or qualitative (trust, fewer bots). Use “projected” or “expected” if not live yet.
- **Quote or metric:** One number or one sentence that sounds concrete (e.g. “25k proofs in 90 days,” “one integration, 5k verifications per month”).

---

## 3 example case study paragraphs (adapt and use)

**Example A – Waitlist / SaaS**  
“We are in discussions with two AI-focused startups that run large waitlists for beta access. Each integrates our Bot-Free Waitlist widget; every signup generates one proof verified via zkVerify. Conservative projection: 8k–12k verifications from these two partners in the first 90 days, forming the core of our M2 target.”

**Example B – Airdrop**  
“One Web3 airdrop platform has committed to pilot our proof-of-human gate before token claim. Their typical campaign has 15k–30k claimants. One campaign would deliver 15k+ proofs to zkVerify, demonstrating both volume and a clear use case for ‘one claim per human’ verified on-chain.”

**Example C – Technical validation**  
“We implemented a minimal proof flow and submitted test proofs to zkVerify’s Volta testnet. Verification latency was under 5 seconds per proof and compatible with our planned Groth16 circuit. This validates our architecture for scaling to 25k and 250k proofs within the grant timeline.”

**Example D – Partner-facing (ideal case study for website / pitch)**  
“We helped a Web3 waitlist go from ~40% bot signups to verified-only signups. They integrated our widget once; every signup now generates a ZK proof verified on zkVerify. They see only ‘verified’ and a receipt—no phone or identity—and we drove 10k+ proofs in the first month.” *(Use “projected” or “expected” if not live.)*

---

## How to use with the 3 agents

- **Agent 1 (Grant strategist):** Ask it to suggest which 2–3 case studies to include and where in the application (e.g. “Traction” or “Milestone 2 strategy”).
- **Agent 2 (Product critic):** Ask it to turn one case study into partner-facing copy (e.g. a one-paragraph “How X uses us” for the website).
- **Agent 3 (Technical architect):** Ask it to help you define and document the “Technical validation” case study (testnet, proof count, latency, cost).

---

---

## Thrive application – copy-paste (Traction / Value Proposition)

Use this block in the Thrive form under **Traction & Validation** or **Value Proposition**:

> We built a proof-of-human verification gateway that submits real Groth16 proofs to zkVerify’s Volta testnet via zkVerifyJS. Each verification is one proof verified on zkVerify; we drive verification volume and keep UX simple (one credential, one click—no phone or identity shared with partners). We are targeting 25k proofs in 90 days through pilot waitlists and airdrop integrations, then 250k by day 150. Our success is zkVerify’s success: every new partner becomes a direct consumer of zkVerify blockspace.

---

## Checklist before submitting

- [ ] At least one **volume** case study (who will generate 25k proofs and how). Place it in “Traction” or “Milestone 2 strategy.”
- [ ] At least one **technical** proof point (testnet, integration, or pilot with numbers). Use the paragraph from `docs/architecture-and-risks.md` or your own testnet results.
- [ ] Clear “projected” or “expected” wording if not live yet—reviewers prefer honest framing.
- [ ] Optional: one **partner-facing** vignette (Example D) for landing page or “Impact” section.
