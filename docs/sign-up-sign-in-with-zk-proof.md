# Sign up & Sign in with ZK proof (no email, no phone in the database)

This document describes the flow you imagined: **user registers with ZK proof**; Site B has **all details confirmed** (this user with zkProof Xx...XXXX is what he is saying) **without ever storing email, cellphone, or any PII**.

---

## The idea

A user registers on Site B **without giving email or cellphone**. They choose **"Sign up with ZK proof"** (or "Sign up with Thrive" / our gateway). They prove once through our flow; Site B gets **all details confirmed** — this user is a verified human, has a verified email (roadmap), is 18+ (roadmap) — **without ever storing that PII**. The database only stores a **ZK-derived identity**: e.g. a nullifier or a stable proof identifier (e.g. `zkProofId: 0xAb...Xy`). When the user comes back, they **"ZK sign in"**: they prove again; Site B matches the proof to that same identity and logs them in. So the user **is what he is saying** (human, has email, 18+) and the site has **zero** email, zero cellphone in its DB.

---

## What Site B stores in the database

Site B does **not** store email, phone, or DOB. It stores only what the ZK flow gives:

| What Site B stores | Meaning |
|--------------------|--------|
| **zk_identifier** (e.g. nullifier for this site/campaign, or persistent anonymous id) | Stable id that ties "this user" across sign-up and sign-in. Same person always produces the same (or a linkable) id; no PII. |
| **verified_human** (boolean) | This identity passed proof-of-human (phone verified with us). |
| **verified_email** (boolean, roadmap) | This identity has a verified email (we never send the email to Site B). |
| **age_18_plus** (boolean, roadmap) | This identity meets age requirement; no DOB stored. |
| **zk_receipt** (optional: tx hash, aggregation id, etc.) | So Site B can verify on-chain that the proof was accepted by zkVerify. |

**Example row (concept):**

| user_id | zk_identifier | verified_human | verified_email | age_18_plus | zk_receipt |
|---------|----------------|----------------|----------------|-------------|------------|
| 12345   | 0x7a3f...9e2  | true           | true           | true        | 0x...      |

So from Site B's point of view: **"User with zkProof 0x7a3f...9e2 is confirmed human, has verified email, and is 18+. We have no email, no cellphone, no DOB."**

---

## Flow: Sign up with ZK proof

1. User visits **Site B** and clicks **"Sign up"** → Site B shows **"Sign up with ZK proof"** (or "Verify with Thrive").
2. User is sent to **our gateway** (or our widget). If they don't have a credential yet, they verify once (e.g. phone or email with us); we issue a credential and never store the PII.
3. User clicks **"Prove"** (or "Sign in with ZK proof"). We generate a ZK proof ("I hold a valid credential"; optionally "I have verified email," "I am 18+") and submit it to zkVerify.
4. We return to Site B: **verified** + **zk_identifier** (e.g. nullifier) + optional **zk_receipt**.
5. Site B **creates an account** in its DB with only: `zk_identifier`, `verified_human`, (optionally) `verified_email`, `age_18_plus`, and optional receipt. **No email, no cellphone.**

---

## Flow: Sign in with ZK proof

1. User returns to **Site B** and clicks **"Sign in"** → Site B shows **"Sign in with ZK proof"**.
2. User proves again via our gateway (same credential). We generate a new proof; the **zk_identifier** (e.g. nullifier for this site) is the same or linkable for the same user.
3. Site B receives **verified** + **zk_identifier**. It looks up the row where `zk_identifier = 0x7a3f...9e2` and logs that user in.
4. Site B has **all details confirmed** again (human, email, 18+) without ever having received or stored email or phone.

So: **Sign up with ZK proof** = register with a ZK-derived identity and verified flags only. **Sign in with ZK proof** = prove again; site matches the proof to the existing account. The user is always "what he is saying" — and the database never holds his email or cellphone.

---

## Summary

- **Sign up with ZK proof:** User registers without giving email or phone. Site B stores only `zk_identifier` + verified booleans + optional receipt. All details confirmed; zero PII in the DB.
- **Sign in with ZK proof:** User proves again; Site B matches the proof to the existing account and logs them in.
- **Database:** Only ZK-derived identity (e.g. 0xAb...Xy) and flags — no email, no cellphone, no DOB.

See also: `docs/web2-program-requirements-mapping.md` (Web2 program fit), `docs/architecture-and-risks.md` (technical flow and what Site B stores).
