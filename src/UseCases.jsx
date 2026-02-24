import { NavLink } from 'react-router-dom'

export default function UseCases() {
  return (
    <div className="container">
      <div className="page-hero">
        <h1>Use cases &amp; roadmap</h1>
        <p>Composable, on-chain proof-of-human layer—not a CAPTCHA, not a centralized database. Multiple credential issuers and ZK use cases, all verified on zkVerify. No PII, no SMS vendor, no bot-farm.</p>
        <p className="muted mt-md">
          Full detail: <code>docs/use-cases-and-roadmap.md</code> — issuers (SMS, email, World ID), ZK use cases (proof-of-human, proof-of-knowledge, age gate, voting), and roadmap. <strong>Milestone 1</strong> includes portable credential (prove on any participating site).
        </p>
      </div>

      <div className="card">
        <h2>Credential issuers (how users get verified)</h2>
        <ul className="use-case-list">
          <li>
            <strong>Phone (SMS)</strong> — Enter phone → receive code → credential issued. We never store phone. <span className="badge success">MVP / M1</span>
          </li>
          <li>
            <strong>Email</strong> — Enter email → receive magic link or code → credential issued. We never store email. <span className="badge muted">Roadmap</span>
          </li>
          <li>
            <strong>World ID</strong> — Verify with World ID Orb → we issue credential. Strong Sybil resistance; Web3-native. <span className="badge muted">Roadmap</span>
          </li>
          <li>
            <strong>Social / OAuth</strong> — Sign in with GitHub/Google; we issue scoped credential. Easy onboarding; weaker anti-bot. <span className="badge muted">Optional</span>
          </li>
        </ul>
        <p className="muted mt-md text-sm">
          Same credential format and same ZK proof flow; only the issuance step differs. Partners can offer &quot;verify with phone&quot;, &quot;verify with email&quot;, or &quot;verify with World ID&quot;.
        </p>
      </div>

      <div className="card">
        <h2>ZK use cases (what the proof proves)</h2>
        <ul className="use-case-list">
          <li>
            <strong>Proof-of-human</strong> — &quot;I am a unique, verified human.&quot; Waitlists, airdrops, signups. <span className="badge success">Core / M1</span>
          </li>
          <li>
            <strong>Proof-of-knowledge</strong> — &quot;I know the answer&quot; without revealing it. Quizzes, bounties, certifications. <span className="badge muted">Roadmap</span>
          </li>
          <li>
            <strong>Age / eligibility gate</strong> — &quot;I am over 18&quot; (or in jurisdiction) without revealing identity. <span className="badge muted">Roadmap</span>
          </li>
          <li>
            <strong>Private voting</strong> — &quot;I am eligible and cast one vote&quot; without revealing choice. DAOs, surveys. <span className="badge muted">Roadmap</span>
          </li>
          <li>
            <strong>Ownership (Web3)</strong> — &quot;I own asset X&quot; without exposing wallet. Gated access, airdrops. <span className="badge muted">Roadmap</span>
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Portable credential (prove everywhere)</h2>
        <p>
          Today the credential lives in this browser only. <strong>Milestone 1</strong> adds a <strong>wallet-based or account-based portable credential</strong> so you verify once and prove you&apos;re human on <strong>any</strong> participating website or app—no re-verification. Same gateway, same zkVerify.
        </p>
      </div>

      <div className="card card-highlight">
        <h2>One gateway, many use cases</h2>
        <p>
          One integration supports multiple credential issuers and ZK use cases, all verified on zkVerify. We start with proof-of-human (SMS, then email and World ID) and expand to proof-of-knowledge, age gating, and private voting. Partners get no PII, no SMS vendor contracts, no bot-farm exposure—just &quot;verified&quot; and an optional receipt.
        </p>
        <NavLink to="/" className="card-cta">Back to Home →</NavLink>
      </div>
    </div>
  )
}
