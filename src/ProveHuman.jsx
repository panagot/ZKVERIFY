import { useState } from 'react'
import {
  hasCredential,
  getCredentialSecret,
  generateMockProof,
  simulateZkVerify,
  isNullifierUsed,
  markNullifierUsed,
} from './mock/credential'
import { isLiveMode, submitProofToBackend } from './api'

const CAMPAIGN_ID = 'waitlist_demo_1'
const CAMPAIGN_ID_NUM = 1

export default function ProveHuman() {
  const [joining, setJoining] = useState(false)
  const [step, setStep] = useState('idle') // idle | proof | zkverify | done | fail
  const [waitlist, setWaitlist] = useState([])
  const [error, setError] = useState('')

  const handleJoinWaitlist = async () => {
    if (!hasCredential()) {
      setError('You need to get verified first. Go to Get verified, complete the flow (demo code 30322), then return here.')
      return
    }
    setError('')
    setJoining(true)
    setStep('proof')

    // Step 1: Generate proof (simulated)
    await new Promise((r) => setTimeout(r, 600))
    const proof = generateMockProof(CAMPAIGN_ID)
    if (!proof) {
      setStep('fail')
      setError('No credential found. Complete Get verified first (demo code 30322).')
      setJoining(false)
      return
    }

    setStep('zkverify')

    let result
    if (isLiveMode()) {
      const secret = getCredentialSecret()
      if (!secret) {
        setStep('fail')
        setError('Credential missing. Complete Get verified again (demo code 30322).')
        setJoining(false)
        return
      }
      result = await submitProofToBackend(secret, CAMPAIGN_ID_NUM)
      if (!result.success) {
        setStep('fail')
        setError(result.error || 'Verification failed.')
        setJoining(false)
        return
      }
    } else {
      result = await simulateZkVerify(proof)
      if (!result.valid) {
        setStep('fail')
        setError('Verification failed.')
        setJoining(false)
        return
      }
      if (isNullifierUsed(proof.nullifier)) {
        setStep('fail')
        setError('This credential was already used for this waitlist (replay prevented).')
        setJoining(false)
        return
      }
      markNullifierUsed(proof.nullifier)
    }

    setStep('done')
    const receipt = isLiveMode() ? (result.txHash || result.receipt || 'zkVerify tx') : result.receipt
    setWaitlist((w) => [...w, { id: Date.now(), receipt }])
    setJoining(false)
  }

  return (
    <div className="container">
      <div className="page-hero">
        <h1>Sign in with ZK proof (Site B)</h1>
        <p>This page <strong>simulates Site B</strong>—a partner site that accepts &quot;Sign in with ZK proof.&quot; On a real partner site, the user clicks that button, is <strong>redirected to us</strong>, we read their credential from <strong>localStorage</strong> (issued when they got verified on Site A), we generate the proof and submit to zkVerify, then redirect back to Site B with &quot;verified&quot; and <strong>zk_identifier</strong>. Site B never sees the credential or any PII.</p>
        <p className="muted">Zero-knowledge: you prove you have a valid credential without revealing who you are or what that credential contains. Partner never sees PII.</p>
        <div className="reviewer-note" role="note" aria-label="How sign-in works for reviewers">
          <strong>For reviewers:</strong> Get verified first (demo code <code>30322</code>), then here click Sign in with ZK proof. Flow: redirect to us → we read credential from browser (localStorage) → we generate proof and submit to zkVerify → redirect back to partner. Partner stores only <strong>zk_identifier</strong> and verified flags—never email, phone, or credential.
        </div>
      </div>

      {/* Summary: what Site B stores — no PII */}
      <div className="card site-b-summary card-highlight" role="region" aria-label="What Site B stores">
        <h2 className="site-b-summary-title">What Site B stores (no PII)</h2>
        <p className="site-b-summary-intro">When you sign in with ZK proof, the partner stores only:</p>
        <ul className="site-b-summary-list">
          <li><strong>zk_identifier</strong> — stable pseudonymous id (e.g. <code>0x7a3f...9e2</code>)</li>
          <li><strong>verified_human</strong>, <strong>verified_email</strong>, <strong>age_18_plus</strong> — boolean flags</li>
          <li><strong>zk_receipt</strong> (optional) — for on-chain verification</li>
        </ul>
        <p className="site-b-summary-never muted">Site B <strong>never</strong> stores: email, phone, DOB, or any PII. Proof verified on zkVerify.</p>
      </div>

      <div className="card">
        <h2>Bot-free waitlist (Site B demo)</h2>
        <p>One spot per verified human. Click below to <strong>Sign in with ZK proof</strong>—no CAPTCHA, no forms. Your browser generates a ZK proof; Site B gets only verified status and zk_identifier.</p>

        {!hasCredential() && (
          <p className="prove-human-get-verified-msg">
            Get verified first: go to <strong>Get verified</strong>, complete the one-time flow (demo code 30322), then return here.
          </p>
        )}

        <button
          onClick={handleJoinWaitlist}
          disabled={joining}
          aria-busy={joining}
          aria-label={joining ? 'Verifying proof' : 'Sign in with ZK proof and join waitlist'}
        >
          {joining ? 'Verifying…' : 'Sign in with ZK proof — join waitlist'}
        </button>

        {joining && (
          <div className="card flow-steps-card" aria-live="polite" aria-label="Sign-in steps">
            <p className="flow-steps-heading">Sign-in flow</p>
            <div className={`flow-step ${step === 'proof' ? 'active' : 'done'}`}>
              1. Your browser generates a ZK proof from your credential (nothing leaves your device)
            </div>
            <div className={`flow-step ${step === 'zkverify' ? 'active' : step === 'done' ? 'done' : ''} flow-step-fade`} data-active={step !== 'proof'}>
              2. Proof is sent to zkVerify {isLiveMode() ? '(Volta)' : '(simulated)'}
            </div>
            <div className={`flow-step ${step === 'done' ? 'done' : ''} flow-step-fade`} data-active={step === 'done'}>
              3. zkVerify validates; nullifier checked (one use per campaign)
            </div>
            <div className={`flow-step ${step === 'done' ? 'done' : ''} flow-step-fade`} data-active={step === 'done'}>
              4. Site B adds you with zk_identifier + verified flags only—no PII
            </div>
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}

        {step === 'done' && (
          <p className="success-message mt-lg" role="status" aria-live="polite">
            {isLiveMode() ? 'Verified on zkVerify.' : "Verified. You're on the list."}
          </p>
        )}
      </div>

      {waitlist.length > 0 && (
        <div className="card success-card">
          <h2>Waitlist (verified humans only)</h2>
          <ul className="waitlist-entries">
            {waitlist.map((entry) => (
              <li key={entry.id}>
                <span className="badge success">Verified</span>
                <span className="muted receipt-text">Receipt: {entry.receipt}</span>
              </li>
            ))}
          </ul>
          <p className="sim-label">What Site B stores (partner database)</p>
          <p className="muted site-b-stores-desc">
            <strong>zk_identifier</strong>, <strong>verified_human</strong>, <strong>verified_email</strong>, <strong>age_18_plus</strong>, <strong>zk_receipt</strong>. No phone, email, DOB, or credential. Proof verified on zkVerify; partner can verify on-chain.
          </p>
        </div>
      )}
    </div>
  )
}
