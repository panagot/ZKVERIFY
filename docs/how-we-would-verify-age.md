# How would someone prove their age with us?

We **do not verify age today**. The current app only verifies **phone** (SMS) or **email**. Age is on the **roadmap**.

---

## How it would work (roadmap)

We would **not** ask for or store the user’s date of birth (DOB). Instead:

1. **Age verification provider**  
   We integrate with an **age verification provider** (e.g. [Yoti](https://www.yoti.com/), [Veriff](https://www.veriff.com/), or a government eID where available). The user proves their age **to that provider**—for example by:
   - Showing an ID document (driver’s licence, passport), or  
   - Using an existing account that is already age-verified by that provider.

2. **We get an attestation, not the age**  
   The provider returns to us only a **binary attestation**, e.g.:
   - `over_18: true`, or  
   - `age_verified: true` (or a signed claim to that effect).  

   They do **not** send us the user’s DOB, full name, or identity. We never see or store the actual age or ID.

3. **We issue a credential**  
   We issue a **credential** (or extend the user’s existing credential) that encodes that claim: “this user has been attested as over 18 by a trusted provider.” The credential is the same kind of thing we use for proof-of-human—secret + commitment—but the claim is “over 18” (or similar) instead of only “verified human.”

4. **User proves on Site B**  
   When the user goes to a partner site (Site B) and clicks “Sign in with ZK proof,” they can prove: **“I hold a credential that attests I am over 18.”** The ZK proof reveals only that statement—**not** their actual age, DOB, or identity. Site B’s database stores only something like `age_18_plus: true` (and `zk_identifier`, etc.), **never** DOB or PII.

---

## Summary

| Question | Answer |
|----------|--------|
| Do we verify age today? | **No.** Only phone and email. |
| Would we ever see the user’s DOB? | **No.** We only receive a binary attestation from a third-party provider. |
| What does Site B get? | A boolean (e.g. `age_18_plus: true`) and a ZK-derived identity—no DOB, no PII. |
| Who actually checks the user’s age? | The **age verification provider** (e.g. Yoti, Veriff). We only trust their attestation and encode it into a credential. |

So: **email and SMS we verify ourselves** (user enters phone/email, we send a code, we verify and issue a credential). **Age we do not verify ourselves**—we would rely on a dedicated age-verification provider that attests “over 18” (or similar) without giving us the user’s DOB, and we would then issue a credential so the user can prove that claim via ZK on any partner site.

See also: [docs/use-cases-and-roadmap.md](use-cases-and-roadmap.md) (Age / eligibility gate row and roadmap).
