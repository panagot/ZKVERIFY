# Architecture & Technical Risks (for Grant Application)

This document supports the grant application with a clear technical plan, risk mitigations, and a recommended commitment/nullifier pattern. Use the “Technical validation” and “Recommended pattern” sections in your application.

---

## System overview

- **Credential issuance (Phase A):** User verifies phone via our backend; backend issues an anonymous credential (commitment) and does not store the phone. Credential is stored in the user’s browser (or, later, bound to a wallet).
- **Proof generation (Phase B):** On a partner site, the user’s browser generates a ZK proof (“I hold a valid credential; here is my nullifier for this campaign”). Proof is sent to our backend.
- **Verification:** Backend submits the proof to zkVerify; zkVerify verifies (e.g. Groth16) and returns valid/invalid and optionally a receipt. Backend checks nullifier DB (replay prevention) and returns result to the partner.
- **Nullifier storage:** Backend stores only nullifiers per campaign; no credentials or phone data.
- **Cost model:** Each verification is one proof submitted to zkVerify. The **submitter account** (backend) pays verification fees (tVFY on Volta, VFY on mainnet). Aggregation and batching on zkVerify keep per-proof cost low; no user wallet is required for the flow. We will monitor tVFY pricing and zkVerify aggregation to keep per-proof cost predictable at scale (25k–250k proofs).

**Trust assumptions (state explicitly for reviewers):**

- **Phase A (issuance):** The issuance server sees the phone number briefly to verify the SMS code; we then **discard** it and do not store it. Users must trust that we do not log or retain PII. (Future: open-source issuance, cryptographic proof of deletion, or attestation.)
- **Phase B (proof):** The **backend** currently centralizes proof submission to zkVerify and **nullifier enforcement** (in-memory or DB). So the backend is a single point of trust for “verified” responses. Partners can reduce this by **verifying directly on zkVerify’s chain** (Option B: user presents receipt; partner checks chain + nullifier). **Roadmap:** nullifier set on-chain or partner-checkable so the backend is not required for verification.

---

## Portable credential: prove on any site or app

**Current (prototype):** The credential is stored only in **this browser’s** localStorage. The user can prove they’re human only on this same origin. If they open another website or app that needs proof-of-human, they would have to get verified again there (or that site would have no access to the credential).

**Goal (production):** The user should be able to **prove ZK everywhere**—any website or app that integrates our gateway should accept the same credential, so the user verifies once and then proves on many sites.

**Ways to make the credential portable:**

1. **Wallet-held credential:** Store the credential (or the secret needed to generate proofs) in the user’s **crypto wallet** (e.g. MetaMask, or a dedicated identity wallet). Any site or dApp that supports “connect wallet + prove human” can request a proof; the wallet holds the credential and can generate proofs for any campaign. Same credential works across browsers and devices where the user has that wallet.
2. **Account / backend-held credential:** User verifies once with us (e.g. phone); we store an anonymous commitment (or encrypted credential) tied to their **account** (e.g. email link or wallet as login). When they visit any partner site, the partner redirects to our gateway; we recognize the user (e.g. session or signed message), generate the proof, submit to zkVerify, and return the result. Portable across devices as long as they log in to us.
3. **On-chain attestation:** After first verification, the user receives an on-chain attestation (e.g. SBT or claim on zkVerify or another chain) that “this address is verified human.” Any site checks the chain. Portable for wallet users.

For the grant and MVP we ship **browser-stored credential** (and optionally backend-generated proof) so the flow works on one site; we **roadmap** wallet or account-based portable credential so the user can prove on any participating website or app without re-verifying.

---

## Site B: “Phone verification” without the user submitting their phone

**Scenario:** User already verified their phone with us on **Site A** and has a credential. They go to **Site B**, which has a policy “users must have completed phone verification.” How can they satisfy Site B **without** giving Site B their phone number?

**How it works:**

1. **Site B’s real requirement** is: “I need assurance this user is a verified human (passed phone verification somewhere I trust).” Site B does **not** need to run its own SMS flow or ever see the phone number. Site B integrates **our gateway** and trusts that we only issue credentials after real phone verification.

2. **User on Site B:** They use their **existing credential** (from Site A). If the credential is portable (e.g. in wallet or account), Site B’s page triggers our flow: “Prove you’re human.” The user approves (e.g. one click or wallet signature). Our system generates a **ZK proof** that says: “I know a secret that matches a valid credential issued by the gateway” — i.e. “I hold a credential that was issued only after phone verification.” The proof reveals **nothing** about the phone number or the credential contents.

3. **Proof submission:** We submit the proof to zkVerify; zkVerify verifies it on-chain. We return to Site B: **“verified”** (and optionally a receipt). Site B never receives the user’s phone number or any PII — only the fact that this user has proved they hold a valid credential (which could only have been issued after phone verification).

4. **What Site B gets:** A boolean “verified” and optionally an on-chain receipt. **What Site B never gets:** The user’s phone number, the credential, or any link to the user’s identity. The user has **proved phone verification via ZK** without submitting their phone to Site B.

**Summary:** Site B’s policy “requires phone verification” is satisfied by **trust in our issuance** (we only issue after phone verification) + **ZK proof** (user proves they hold that credential). No phone is ever sent to Site B.

---

## Sign up & Sign in with ZK proof: what Site B stores

**Vision:** User registers on Site B **without giving email or cellphone**. They choose "Sign up with ZK proof"; they prove through our gateway. Site B gets **all details confirmed** (verified human, has verified email, 18+) and stores only a **ZK-derived identity** in its database — no PII. When the user returns, they "Sign in with ZK proof"; Site B matches the proof to that identity and logs them in.

**What Site B stores (and does not store):**

- **Stores:** A stable **zk_identifier** (e.g. nullifier for this site/campaign, or persistent anonymous id), booleans (**verified_human**, **verified_email**, **age_18_plus**), and optionally a **zk_receipt** (tx hash, aggregation id) so the site can verify on-chain.
- **Does not store:** Email, cellphone, DOB, or any PII. The user "is what he is saying" — the proof attests to verified human, email ownership, age — without revealing the underlying data.

So the database row is conceptually: `user_id | zk_identifier (e.g. 0xAb...Xy) | verified_human | verified_email | age_18_plus | zk_receipt`. Same user always produces the same (or linkable) zk_identifier, so sign-in is "prove again → match to existing account." See `docs/web2-program-requirements-mapping.md` for the full "Sign up & Sign in with ZK proof" flow and example table.

---

## How User A submits proof to another site (and does Site B see their wallet?)

**The problem:** User A verified their phone with us and has a credential. On **another site** (Site B), how does User A submit or prove that with ZK — and will Site B know who they are (e.g. by wallet connection)?

**Three ways User A can "submit" proof to Site B:**

**1. Wallet connection (credential in wallet)**  
- User A's credential (or the secret to generate proofs) lives in their **wallet**. On Site B, User A clicks "Prove you're human" and **connects their wallet**. Our widget/SDK asks the wallet to generate a proof for Site B's campaign; the proof is submitted to zkVerify (by our backend or by the wallet). Site B gets "verified" (and optionally a receipt).  
- **Does Site B know by wallet connection?** **Yes.** Site B asked for wallet connect to trigger the flow, so Site B sees **User A's wallet address**. Site B does **not** see the phone number or the credential — only that "this wallet address is verified." So the tradeoff: **portable credential + one identity (wallet) that Site B can see.** Good for "one wallet = one human" (e.g. airdrops); the site can link that wallet across visits. If we want Site B to **not** know the user's wallet, we need a different flow (2 or 3).

**2. Account / redirect (credential with us, no wallet on Site B)**  
- User A's credential is held by **us** (tied to an account: e.g. email magic link or a long-lived token in their browser). On Site B, User A clicks "Prove you're human" and is **redirected to our gateway**. We recognize them (session or token), generate the proof, submit to zkVerify, and **redirect back to Site B** with a one-time token or signed assertion ("this session is verified for campaign Y"). Site B never sees a wallet; Site B only sees "this browser/session is verified."  
- **Does Site B know by wallet connection?** **No.** Site B does not need wallet connection. Site B only knows "this session just received a valid verification" — no wallet address unless we put it in the token (we don't have to). So **portable credential + Site B does not learn wallet**; they only know "verified" for this session.

**3. Receipt-only (user presents proof of verification)**  
- User A proves somewhere (our site or any integrated site) and receives a **receipt** (tx hash + public inputs, e.g. nullifier, campaign_id). On Site B, User A **pastes or submits that receipt** (e.g. in a form). Site B (or their backend) **checks zkVerify's chain** and confirms the proof was verified and the nullifier is valid for their campaign.  
- **Does Site B know by wallet connection?** **No.** In our current design the proof is submitted by **our backend**, so the on-chain tx is from our account, not User A's wallet. The receipt does not reveal User A's wallet. Site B only knows "someone with this nullifier/receipt is verified." So **maximum privacy for User A**: Site B gets verification and replay protection (nullifier) but does not get phone or wallet.

**Summary**

| Flow | Credential lives in | How User A proves on Site B | Does Site B see wallet? | Does Site B see phone? |
|------|---------------------|-----------------------------|--------------------------|-------------------------|
| Wallet | User's wallet | Connect wallet → proof generated & submitted | **Yes** (wallet address) | No |
| Account / redirect | Our backend (tied to user's account/session) | Redirect to us → we prove → redirect back with token | **No** (unless we pass it) | No |
| Receipt-only | Any (we or wallet) | User presents receipt; Site B checks chain | **No** (if we submit proof) | No |

So **"will the other site know by wallet connection?"** — only if we use **wallet-based** flow and Site B requires wallet connect to prove. If we use **account/redirect** or **receipt-only**, Site B can get "verified" without ever seeing User A's wallet. We can offer both: wallet flow for Web3/airdrop use cases where the site wants to bind "one wallet = one human," and account/receipt flow where the site only needs "this session is verified" with no wallet.

---

## How Site B can verify: our API vs. the blockchain

Site B can learn that the user is verified in two ways: by using **our widget/API**, or by **checking the proof on the blockchain** (zkVerify) and not calling our backend for verification.

**Option A — Site B uses our widget / API**

- Site B embeds our widget or calls our API. The user proves through our flow; we submit the proof to zkVerify and get a receipt. We return to Site B: **verified** (and optionally the receipt). Site B trusts our response. Simple; Site B does not read any chain. Downside: Site B depends on our service for the verification step.

**Option B — Site B verifies on the blockchain**

- The proof is submitted to **zkVerify** (by us, the user's wallet, or another prover). zkVerify verifies it and records the result **on-chain** (e.g. verification event, aggregation receipt, tx hash). The user receives a **receipt** (e.g. transaction hash, aggregation id, or statement id) and the **public inputs** (e.g. campaign_id, nullifier).
- The user presents that **receipt and public inputs** to Site B. Site B (or their backend) **queries zkVerify's chain** (or an indexer/RPC) and checks: (1) this receipt exists and corresponds to a valid proof verification, and (2) the public inputs match what Site B expects (e.g. their campaign id, and a nullifier they have not seen before for replay protection). If both hold, Site B treats the user as verified.
- Site B does **not** need to call our API for verification. They only need to trust **zkVerify** and (for "phone verification") that the credential was issued by a trusted issuer (us) after phone verification. So **yes — Site B can seek the proof on the blockchain** and verify it themselves. Issuance (phone to credential) can still be done by us; proof generation and submission can be done by us or by the user's wallet; verification by Site B is then fully on-chain.

**Summary**

| | Option A (our API) | Option B (blockchain) |
|---|-------------------|------------------------|
| Site B calls us for verification? | Yes | No — Site B reads zkVerify chain |
| Site B needs our widget? | Yes (or API) | No — only the user needs a way to get a receipt (e.g. our flow or wallet) |
| Trust | Site B trusts us and zkVerify | Site B trusts zkVerify and issuer (us) for issuance |

Both are valid. Option B is more decentralized and removes our backend from the verification path; Option A is simpler for Site B to integrate.

---

## Technical risks and mitigations

| # | Risk | Mitigation |
|---|------|------------|
| 1 | **Replay:** Same proof used twice for one campaign | Nullifier per (credential, campaign_id). Backend rejects if nullifier already in DB for that campaign. |
| 2 | **Key / credential leakage** | Credential material never leaves the client except as input to the ZK circuit; server never sees secret. Use HTTPS and secure storage (e.g. localStorage or wallet). |
| 3 | **Proof format compatibility with zkVerify** | Use a proof system supported by zkVerify (e.g. Groth16). Confirm public inputs and submission API with zkVerify docs before final circuit. |
| 4 | **Throughput / cost at 250k proofs** | Design for zkVerify’s aggregation and batching; use a single circuit with minimal public inputs to keep verification cheap. |
| 5 | **Phone verification abuse (multiple numbers)** | Rate limits, optional CAPTCHA before SMS, and monitoring; long-term add World ID as a stronger option. |
| 6 | **Backend centralization / compromise** | Backend controls submission and nullifier DB. Mitigation: rate limits, monitoring; roadmap to on-chain nullifier or partner-side verification so partners don’t depend on our API for verification. |
| 7 | **Proof generation latency (browser)** | Groth16 in browser can be slow on mobile. We will measure and document proof-gen time; optimize via smaller circuit, wasm, or server-assisted proving if needed. |
| 8 | **Nullifier linkability** | Nullifier is deterministic per (secret, campaign_id). Cross-campaign linkage is not possible without the secret; for highly sensitive campaigns (e.g. voting), future option: per-campaign salts or blinded nullifiers. |
| 9 | **Abuse via multiple browsers / clear storage** | Credential in localStorage: user can clear storage, re-verify, get new credential. Mitigation: server-side rate limits and issuance tracking; portable credential (wallet/account) reduces “re-verify on new device” abuse. |
| 10 | **Regulatory / compliance** | We do not store PII; partners are responsible for their own compliance (KYC, jurisdiction). We provide verification proofs only; use case determines regulatory burden. |

---

## Recommended pattern: commitment and nullifier (phone-based)

**Goal:** (a) Server never stores phone. (b) One credential can be used once per campaign (nullifier per campaign). (c) No linkage across campaigns.

**Issuance (after SMS verification):**

1. User proves they received the SMS (correct code). Server verifies code then **discards** phone and code.
2. Server generates a random **commitment** (e.g. `C = H(secret_server_salt || random_user_id)` where `random_user_id` is a one-time nonce). Server stores only `C` (or a hash of it) in an “issued commitments” set, not the phone.
3. Server returns to the client a **credential** that binds the user to `C` (e.g. signed token or encrypted payload containing the secret needed to prove knowledge of `C`). Client stores this in browser (or wallet).

**Proof (per campaign):**

1. Client has credential → can compute **nullifier** `N = H(credential_secret || campaign_id)` (or a ZK-friendly equivalent so the same credential yields the same N for the same campaign, and different N for different campaigns).
2. Circuit proves: “I know a credential that (i) corresponds to a commitment in the issued set, and (ii) hashes to nullifier N for this campaign_id.” Public inputs: `campaign_id`, `N`, and commitment root or similar.
3. Backend receives proof + `N` + `campaign_id`. Submits proof to zkVerify. If valid, backend checks: is `N` already in nullifier DB for `campaign_id`? If no, add it and return “verified”; if yes, return “replay.”

**Result:** Server never sees phone. Same credential can be used in many campaigns (different nullifiers). No linkage across campaigns because nullifiers are campaign-scoped and not linkable to the credential without the secret.

---

## Minimal circuit design (for application)

- **Statement:** “I possess a valid credential (commitment in the issued set) and derive nullifier N for public campaign_id.”
- **Public inputs:** `campaign_id`, `nullifier`, and optionally a root of the set of commitments (Merkle root) so the circuit checks inclusion.
- **Private inputs:** Credential secret, Merkle path (if using Merkle tree), and any randomness for nullifier derivation.
- **Output:** Standard Groth16 proof verifiable by zkVerify. Keep the circuit small (few constraints) to minimize verification cost and latency.

**Production circuit (post-MVP):** The current MVP circuit is minimal. For production we will use: (a) **Merkle inclusion** so the circuit proves the credential’s commitment is in the issued set (verifiable root); (b) **Poseidon** (or ZK-friendly hash) for commitment and nullifier derivation, e.g. `nullifier = Poseidon(secret, campaign_id)` so the same credential yields the same N per campaign and different N across campaigns with no cross-campaign linkability. Post-MVP we will commission a third-party audit of the production circuit before mainnet.

---

## Technical validation (paragraph for application)

We implemented a minimal proof flow and submitted test proofs to zkVerify’s Volta testnet. Verification latency was under 5 seconds per proof and compatible with our planned Groth16 circuit and public inputs. We confirmed submission format and receipt handling with zkVerify documentation. When applying: include a Volta tx hash (or aggregation receipt) as proof of test submission; where available, report proof generation time and verification time separately. This validates our architecture for scaling to 25k proofs by day 90 and 250k by day 150 within the grant timeline.

*(Replace “under 5 seconds” and “Volta testnet” with your actual numbers and environment once you have them.)*
