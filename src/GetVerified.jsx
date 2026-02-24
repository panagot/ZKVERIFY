import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { issueMockCredential, hasCredential, getCredentialSource } from './mock/credential'

const DEMO_CODE = '30322'
const METHODS = { phone: 'sms', email: 'email' }

function ForReviewersLocalStorage({ id = 'reviewers-localstorage', defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="reviewers-localstorage-card" role="region" aria-labelledby={`${id}-heading`}>
      <button
        type="button"
        id={`${id}-heading`}
        className="reviewers-localstorage-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-content`}
      >
        For reviewers: how credential storage works (localStorage)
      </button>
      <div id={`${id}-content`} className="reviewers-localstorage-content" hidden={!open}>
        <h4>We do not use a cookie</h4>
        <p>We store the <strong>credential</strong> (secret + commitment) in the browser&apos;s <strong>localStorage</strong> under our origin only. In this demo the key is <code>zk_prototype_credential</code>. Only our site can read or write it.</p>
        <h4>localStorage is origin-bound</h4>
        <p>Site B cannot read your credential. When you click &quot;Sign in with ZK proof&quot; on Site B, you are <strong>redirected to our site</strong>. Our page loads, <strong>reads the credential from localStorage</strong> (same origin), generates the ZK proof, submits it to zkVerify, then <strong>redirects back to Site B</strong> with a token. No email, phone, or credential is ever sent to Site B.</p>
        <h4>Persistence and server storage</h4>
        <p>The credential <strong>does not expire</strong>—localStorage persists until you or the app clears it. On our server we store <strong>only nullifiers per campaign</strong> (to prevent replay)—no PII.</p>
      </div>
    </div>
  )
}

export default function GetVerified() {
  const [method, setMethod] = useState('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(hasCredential())
  const [step, setStep] = useState(verified ? 'done' : 'input')

  const isEmail = method === 'email'

  const handleSendCode = (e) => {
    e.preventDefault()
    if (isEmail ? !email.trim() : !phone.trim()) return
    setCodeSent(true)
    setStep('code')
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    const ok = code === DEMO_CODE || /^\d{5,6}$/.test(code)
    if (!ok) return
    issueMockCredential({ source: METHODS[method] })
    setVerified(true)
    setStep('done')
  }

  if (verified) {
    const source = getCredentialSource()
    const viaEmail = source === 'email'
    return (
      <div className="container">
        <div className="page-hero">
          <h1>You&apos;re verified</h1>
          <p className="success-hero-text">Flow completed: you entered {viaEmail ? 'email' : 'phone'} → received a code → entered the code → credential was issued and stored in your browser. Use &quot;Prove human&quot; on any partner site to sign in with ZK proof—one click.</p>
        </div>
        <div className="card success-card">
          <p className="what-happens-callout" role="status">
            We verified you, converted that to a cryptographic commitment, and issued your zkProof credential. <strong>We never store</strong> your {viaEmail ? 'email' : 'phone'} or verification code—only <strong>nullifiers per campaign</strong> (to prevent replay). No PII. Proof verified on zkVerify.
          </p>
          <div className="step-indicator" aria-label="Verification steps completed">
            <span className="step-dot done">1</span>
            <span className="step-dot done">2</span>
            <span className="step-dot done">3</span>
            <span className="step-dot done">4</span>
          </div>
          <div className="flow-step done">Enter {viaEmail ? 'email' : 'phone'}</div>
          <div className="flow-step done">Receive {viaEmail ? 'magic link or code' : 'SMS code'}</div>
          <div className="flow-step done">Enter code</div>
          <div className="flow-step done">Credential issued in browser (localStorage)</div>
          <p className="success-message">
            Your credential lives in this browser. Prove you&apos;re a verified human on partner sites with one click—we never share your {viaEmail ? 'email' : 'phone'} or identity with them.
          </p>
          <div className="flow-db-box" role="region" aria-label="What we store">
            <h4>What we store in our database</h4>
            <p className="flow-db-we-store">We <strong>do not</strong> store your {viaEmail ? 'email' : 'phone'}, verification code, or any PII. Only <strong>nullifiers per campaign</strong> (to prevent replay)—no personal data.</p>
          </div>
          <ForReviewersLocalStorage id="reviewers-success" defaultOpen={false} />
          <NavLink to="/prove-human" className="card-cta card-cta-primary">Try partner waitlist (Site B) →</NavLink>
          <p className="sim-label">Demo</p>
          <p className="page-hero muted">
            In this demo the credential lives <strong>only in this browser</strong>. You can prove human here and on partner pages we host. <strong>Milestone 1</strong> adds a <strong>portable credential</strong> (wallet or account) so you can prove you&apos;re human on <strong>any</strong> participating site without verifying again.
          </p>
          <p className="page-hero muted mt-sm">
            Storage: <code>zk_prototype_credential</code> (localStorage) — no {viaEmail ? 'email' : 'phone'} or code is kept.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-hero">
        <h1>Get your verified-human credential</h1>
        <p>One-time setup: <strong>enter phone or email</strong> → <strong>receive a code</strong> → <strong>enter the code</strong> → we issue a <strong>zkProof credential</strong> and store it in your browser (localStorage). Use it to sign in with ZK proof on any partner site—one click.</p>
        <p className="what-happens-inline muted">We verify you control the channel, convert that to a cryptographic commitment, and issue your credential. <strong>We never store</strong> your email, phone, or code—only <strong>nullifiers per campaign</strong> (to prevent replay). No PII. Proof verified on zkVerify.</p>
      </div>

      <div className="card verification-card">
        <h2>Verify with</h2>
        <p className="muted text-sm mb-md" role="note" aria-label="Demo code for reviewers">
          <strong>For reviewers:</strong> Demo code <code>30322</code> completes verification (any 5–6 digits in this demo).
        </p>
        <div className="method-tabs" role="tablist" aria-label="Verification method">
          <button
            type="button"
            role="tab"
            aria-selected={method === 'phone'}
            className={`method-tab ${method === 'phone' ? 'active' : ''}`}
            onClick={() => { setMethod('phone'); setStep('input'); setCodeSent(false); setCode(''); }}
          >
            Phone (SMS)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={method === 'email'}
            className={`method-tab ${method === 'email' ? 'active' : ''}`}
            onClick={() => { setMethod('email'); setStep('input'); setCodeSent(false); setCode(''); }}
          >
            Email
          </button>
        </div>

        {step === 'input' && (
          <>
            <p className="step-progress-label" aria-live="polite">Step 1 of 4: Enter your phone or email</p>
            <div className="step-indicator" aria-label="Verification progress">
              <span className="step-dot active">1</span>
              <span className="step-dot">2</span>
              <span className="step-dot">3</span>
              <span className="step-dot">4</span>
            </div>
            <div className="flow-step active">Enter your {isEmail ? 'email' : 'phone number'}</div>
            <div className="flow-step">Receive {isEmail ? 'link or code' : 'SMS code'}</div>
            <div className="flow-step">Enter code</div>
            <div className="flow-step">Credential issued in browser (localStorage)</div>
            <form onSubmit={handleSendCode} aria-label={isEmail ? 'Enter email for verification' : 'Enter phone number for verification'}>
              {isEmail ? (
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  aria-label="Email address"
                  required
                />
              ) : (
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                  aria-label="Phone number"
                  required
                />
              )}
              <button type="submit" aria-label={isEmail ? 'Send verification link' : 'Send SMS code'}>
                {isEmail ? 'Send verification link' : 'Send SMS code'}
              </button>
            </form>
            <p className="sim-label">Demo</p>
            <p className="muted text-sm">
              No real {isEmail ? 'email' : 'SMS'}. Click &quot;Send&quot; to continue; on the next step use demo code <strong>30322</strong>.
            </p>
          </>
        )}

        {step === 'code' && (
          <>
            <p className="step-progress-label" aria-live="polite">Step 3 of 4: Enter verification code</p>
            <div className="step-indicator" aria-label="Verification progress">
              <span className="step-dot done">1</span>
              <span className="step-dot done">2</span>
              <span className="step-dot active">3</span>
              <span className="step-dot">4</span>
            </div>
            <div className="flow-step done">Enter your {isEmail ? 'email' : 'phone number'}</div>
            <div className="flow-step done">Receive {isEmail ? 'link or code' : 'SMS code'}</div>
            <div className="flow-step active">Enter code</div>
            <div className="flow-step">Credential issued in browser (localStorage)</div>
            <form onSubmit={handleVerifyCode} aria-label="Enter verification code">
              <label htmlFor="verify-code-input" className="visually-hidden">Verification code</label>
              <input
                id="verify-code-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 30322 (demo code)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                autoFocus
                aria-label="Verification code (demo: 30322)"
                aria-describedby="code-hint"
              />
              <p id="code-hint" className="muted text-sm code-hint">
                Demo: enter <strong>30322</strong> (or any 5–6 digits) to complete. In production, only the real code works.
              </p>
              <button type="submit">Verify &amp; get credential</button>
            </form>
          </>
        )}

        <ForReviewersLocalStorage id="reviewers-verification" defaultOpen={false} />
      </div>
    </div>
  )
}
