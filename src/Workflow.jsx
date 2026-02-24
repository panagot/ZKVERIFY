import { NavLink } from 'react-router-dom'

export default function Workflow() {
  return (
    <div className="container workflow-page">
      <div className="page-hero">
        <h1>How it works</h1>
        <p>Visual walkthrough of the proof-of-human flow: from verification (Site A) to signing in on a partner site (Site B). Privacy-preserving—no PII leaves the first step.</p>
        <p className="muted mt-md">
          Technical integration with zkVerify (proof generation, zkVerifyJS): see <code>docs/zkverify-how-we-integrate.md</code> in this repo.
        </p>
      </div>

      {/* Concept in one box */}
      <div className="card card-highlight">
        <h2>The concept in one sentence</h2>
        <p className="workflow-concept">
          You prove you verified your phone <strong>without showing your phone number</strong>; that proof is <strong>verified on zkVerify</strong>, so any partner site can trust &quot;this user is a verified human&quot; and receives only &quot;verified&quot; + an optional receipt—never your identity.
        </p>
      </div>

      {/* Main flow diagram */}
      <div className="card">
        <h2>End-to-end flow</h2>
        <p className="muted mb-lg">
          From phone verification to proving on another website. Your phone never leaves the first step; the other site never sees it.
        </p>
        <div className="flow-diagram" role="img" aria-label="Flow: User verifies phone, gets credential, visits partner site, generates ZK proof, zkVerify verifies, partner sees verified">
          <svg viewBox="0 0 620 200" className="flow-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
              </marker>
            </defs>
            {/* Boxes */}
            <rect x="10" y="70" width="90" height="60" rx="8" className="flow-box flow-box-user" />
            <text x="55" y="102" textAnchor="middle" className="flow-label">User</text>

            <rect x="120" y="70" width="100" height="60" rx="8" className="flow-box flow-box-verify" />
            <text x="170" y="95" textAnchor="middle" className="flow-label">Phone</text>
            <text x="170" y="112" textAnchor="middle" className="flow-label">verify</text>

            <rect x="240" y="70" width="100" height="60" rx="8" className="flow-box flow-box-cred" />
            <text x="290" y="95" textAnchor="middle" className="flow-label">Credential</text>
            <text x="290" y="112" textAnchor="middle" className="flow-label">(browser/wallet)</text>

            <rect x="360" y="70" width="100" height="60" rx="8" className="flow-box flow-box-partner" />
            <text x="410" y="95" textAnchor="middle" className="flow-label">Partner</text>
            <text x="410" y="112" textAnchor="middle" className="flow-label">site</text>

            <rect x="480" y="70" width="130" height="60" rx="8" className="flow-box flow-box-zk" />
            <text x="545" y="95" textAnchor="middle" className="flow-label">zkVerify</text>
            <text x="545" y="112" textAnchor="middle" className="flow-label">(on-chain)</text>

            {/* Arrows */}
            <line x1="100" y1="100" x2="118" y2="100" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="220" y1="100" x2="238" y2="100" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="340" y1="100" x2="358" y2="100" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="460" y1="100" x2="478" y2="100" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Labels under arrows */}
            <text x="109" y="165" textAnchor="middle" className="flow-caption">1. Verify</text>
            <text x="229" y="165" textAnchor="middle" className="flow-caption">2. Credential</text>
            <text x="349" y="165" textAnchor="middle" className="flow-caption">3. Prove</text>
            <text x="469" y="165" textAnchor="middle" className="flow-caption">4. Verified</text>
          </svg>
        </div>
      </div>

      {/* How credential is used on Site B (localStorage) — for reviewers */}
      <div className="card localStorage-explainer card-highlight">
        <h2>For reviewers: how localStorage is used on Site B</h2>
        <p>The credential lives in the user&apos;s browser on <strong>our origin</strong> (key: <code>zk_prototype_credential</code>). When they&apos;re on a partner site (Site B) and click &quot;Sign in with ZK proof,&quot; they are redirected to us. We read the credential from <strong>localStorage</strong>, generate the proof, submit to zkVerify, then redirect them back to the partner. The partner receives only verified status and <strong>zk_identifier</strong>—never the credential or PII.</p>
      </div>

      {/* Step-by-step timeline */}
      <div className="card">
        <h2>Step-by-step (for reviewers)</h2>
        <div className="timeline">
          <div className="timeline-step">
            <div className="timeline-marker">1</div>
            <div className="timeline-content">
              <h3>User verifies phone once (with us)</h3>
              <p>User enters phone → receives SMS code → enters code. We <strong>verify the code and discard the phone</strong>. We do not store it. We issue an anonymous <strong>credential</strong> (secret + commitment) and store it in the user’s browser—or later in their wallet or account.</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="timeline-marker">2</div>
            <div className="timeline-content">
              <h3>User has a credential</h3>
              <p>Only the user (their browser or wallet) holds the credential. It proves “this person passed phone verification” without revealing the phone number. Same credential can be used many times—once per campaign (nullifier prevents replay).</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="timeline-marker">3</div>
            <div className="timeline-content">
              <h3>User visits another website (partner)</h3>
              <p>The partner site needs “proof of human” (e.g. for a waitlist or airdrop). The user clicks “Prove I’m human.” Their browser (or wallet) generates a <strong>ZK proof</strong>: “I have a valid credential for this campaign.” The proof is sent to our backend (or directly to zkVerify).</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="timeline-marker">4</div>
            <div className="timeline-content">
              <h3>zkVerify verifies the proof on-chain</h3>
              <p>zkVerify receives the proof, verifies it (e.g. Groth16), and records the result on-chain. We get a receipt (tx hash, aggregation id). We check the nullifier (one use per campaign) and tell the partner: <strong>“verified.”</strong> Or the partner can check the chain themselves (Option B).</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="timeline-marker">✓</div>
            <div className="timeline-content">
              <h3>What the partner gets (Sign in with ZK proof)</h3>
              <p><strong>Option A (our API):</strong> We return “verified” + optional receipt. Partner never sees the user’s phone or credential.<br /><strong>Option B (on-chain):</strong> User presents a receipt; partner checks zkVerify’s chain and nullifier. Same result—no phone, no PII.</p>
              <p className="workflow-site-b-stores muted">When the user signs in with ZK proof, Site B stores only: <strong>zk_identifier</strong>, <strong>verified_human</strong>, <strong>verified_email</strong>, <strong>age_18_plus</strong>, <strong>zk_receipt</strong>. Never email, phone, or DOB.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What the partner sees - visual */}
      <div className="card">
        <h2>What the partner gets (and never gets)</h2>
        <div className="partner-visual">
          <div className="partner-box partner-gets">
            <h4>Partner gets</h4>
            <ul>
              <li><strong>zk_identifier</strong> — stable pseudonymous id</li>
              <li><strong>Verified</strong> flags (verified_human, verified_email, age_18_plus)</li>
              <li>Optional on-chain receipt (tx hash, nullifier)</li>
              <li>Replay protection (one use per campaign)</li>
            </ul>
          </div>
          <div className="partner-box partner-never">
            <h4>Partner never gets</h4>
            <ul>
              <li>User&apos;s phone number</li>
              <li>User&apos;s email or identity</li>
              <li>The credential or secret</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Link to try */}
      <div className="card card-highlight">
        <h2>For reviewers: try it yourself</h2>
        <p>Complete <strong>Get verified</strong> first (demo code <strong>30322</strong>), then <strong>Prove human</strong> to simulate signing in on a partner waitlist.</p>
        <div className="cta-group">
          <NavLink to="/get-verified" className="card-cta card-cta-primary">Get verified →</NavLink>
          <NavLink to="/prove-human" className="card-cta card-cta-primary">Prove human →</NavLink>
        </div>
      </div>
    </div>
  )
}
