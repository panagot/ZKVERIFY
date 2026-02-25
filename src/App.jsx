import { NavLink, Routes, Route } from 'react-router-dom'
import GetVerified from './GetVerified'
import ProveHuman from './ProveHuman'
import UseCases from './UseCases'
import Workflow from './Workflow'
import PartnerIntegration from './PartnerIntegration'
import { isLiveMode } from './api'

function Home() {
  return (
    <>
      <div className="hero container">
        <h1>Privacy-preserving proof-of-human verification</h1>
        <p className="hero-sub">One credential, one click. Prove you&apos;re a verified human—not who you are. No PII, no SMS vendor, no bot-farm. Every verification is a ZK proof on zkVerify.</p>
        <p className="hero-note">
          {isLiveMode() ? 'Connected to backend; proofs are submitted to zkVerify Volta.' : 'This demo shows the full flow: Site A (get verified) → Site B (sign in with ZK proof). ZK and zkVerify are simulated locally.'}
        </p>
      </div>

      <div className="container">
        {/* Site A (us) vs Site B — clear for reviewers */}
        <section className="flow-sites" aria-label="Site A and Site B flow">
          <h2 className="flow-sites-title">Two sites, one flow: Site A (Thrive) → Site B (partner)</h2>

          <div className="card flow-site flow-site-a card-highlight">
            <span className="flow-site-badge">Site A — Thrive (us)</span>
            <h3>Where you get verified</h3>
            <p>Users register with us using contact details. Example (demo):</p>
            <ul className="flow-site-details">
              <li><strong>Email:</strong> example@google.com</li>
              <li><strong>Age:</strong> 21</li>
              <li><strong>Cellphone:</strong> 6543246</li>
            </ul>
            <p>We verify the inputs, convert them into a <strong>cryptographic commitment</strong>, and issue a <strong>zkProof credential</strong> stored in the browser (localStorage—not a cookie). <strong>We never store</strong> email, phone, or PII. When you prove on a partner site, your browser generates a ZK proof and we submit it to zkVerify.</p>
            <div className="flow-db-box">
              <h4>What we store in our database</h4>
              <p className="flow-db-we-store">We <strong>do not</strong> store email, phone, age, or any PII. Only <strong>nullifiers per campaign</strong> (to prevent replay)—no personal data.</p>
            </div>
            <NavLink to="/get-verified" className="card-cta card-cta-primary">Get verified (Site A) →</NavLink>
          </div>

          <div className="flow-sites-connector" aria-hidden="true">↓ then on any partner site</div>

          <div className="card flow-site flow-site-b card-highlight">
            <span className="flow-site-badge">Site B — Partner</span>
            <h3>Sign in with ZK proof</h3>
            <p>On a partner site (Site B), the user clicks <strong>&quot;Sign in with ZK proof&quot;</strong>. They prove they&apos;re a <strong>verified human</strong> via our gateway—no email, phone, or age is sent to Site B. Site B receives only <strong>zk_identifier</strong> and verified flags; it never sees PII.</p>
            <div className="flow-db-box">
              <h4>What Site B stores</h4>
              <ul className="flow-site-details flow-db-list">
                <li><strong>zk_identifier</strong> (e.g. <code>0x7a3f...9e2</code>) — stable pseudonymous id</li>
                <li><strong>verified_human</strong>, <strong>verified_email</strong>, <strong>age_18_plus</strong> — boolean flags</li>
                <li><strong>zk_receipt</strong> (optional) — for on-chain verification</li>
              </ul>
              <p className="flow-db-never">Site B <strong>never</strong> stores: email, phone, DOB, or any PII.</p>
            </div>
            <NavLink to="/prove-human" className="card-cta card-cta-primary">Try partner waitlist (Site B) →</NavLink>
          </div>
        </section>

        <div className="card card-highlight">
          <h2>How it works</h2>
          <p>Step-by-step workflow, flow diagram, and &quot;what the partner gets&quot;—from verification to proving on another site. <strong>For reviewers:</strong> follow the flow and try both paths.</p>
          <NavLink to="/workflow" className="card-cta">View workflow &amp; diagrams →</NavLink>
        </div>

        <div className="card card-highlight">
          <h2>Why partners use us</h2>
          <p>
            Bot-resistant signups and waitlists without handling user identity. <strong>No PII storage, no SMS vendor contracts, no bot-farm exposure.</strong> One integration; every verification is a ZK proof verified on zkVerify. Partners get only &quot;verified&quot; and an optional on-chain receipt—not a CAPTCHA, not a centralized database.
          </p>
          <p className="quote">One campaign with 15k claimants = 15k proofs to zkVerify. No phone, no PII—just proof volume.</p>
        </div>

        <div className="card">
          <h2>Phase A: Get verified</h2>
          <p>One-time: enter phone (or email in demo), receive a code, get an anonymous credential in your browser. We never store your phone or code—only a commitment so you can prove you&apos;re human later. Proof verified on zkVerify.</p>
          <NavLink to="/get-verified" className="card-cta">Get verified →</NavLink>
        </div>

        <div className="card">
          <h2>Phase B: Prove human</h2>
          <p>On a partner site, click once. Your browser generates a ZK proof; we send it to zkVerify. The partner sees only &quot;verified&quot;—no identity shared. Milestone 1 adds a portable credential (wallet or account) so you can prove on any participating site.</p>
          <NavLink to="/prove-human" className="card-cta">Try partner waitlist →</NavLink>
        </div>

        <div className="card">
          <h2>Use cases &amp; roadmap</h2>
          <p>Proof-of-human via phone first (email and World ID on roadmap). Then proof-of-knowledge, age gate, voting—same gateway, same zkVerify. Portable credential (prove everywhere) is in Milestone 1.</p>
          <NavLink to="/use-cases" className="card-cta">View use cases →</NavLink>
        </div>

        <div className="card card-highlight">
          <h2>For partners (Site B): widget &amp; API example</h2>
          <p>Reviewers: see how Site B integrates &quot;Sign in with ZK proof&quot;—example widget (HTML/link) and API response shape (zk_identifier, verified_human, no PII).</p>
          <NavLink to="/for-partners" className="card-cta">Widget &amp; API example →</NavLink>
        </div>

        <section className="home-quick-start" aria-label="Quick start for reviewers">
          <h2 className="flow-sites-title">For reviewers: try the full flow</h2>
          <div className="card card-highlight">
            <p><strong>1.</strong> Go to <strong>Get verified</strong> → choose Phone or Email → use demo code <code>30322</code> → credential is stored in your browser.</p>
            <p><strong>2.</strong> Go to <strong>Prove</strong> (partner waitlist) → click &quot;Sign in with ZK proof&quot; → you&apos;re added with no PII shared.</p>
            <p className="muted text-sm mt-md">No backend required for demo. Proof verified on zkVerify in production.</p>
            <div className="cta-group mt-lg">
              <NavLink to="/get-verified" className="card-cta card-cta-primary">Get verified →</NavLink>
              <NavLink to="/prove-human" className="card-cta">Try partner waitlist →</NavLink>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="logo" aria-label="Proof-of-Human zkVerify — Home">
            <img src="/logo/logo1.png" alt="" className="logo-img" width="36" height="36" />
            <span className="logo-text">Proof-of-Human<span> · zkVerify</span></span>
            <span className="mode-badge" aria-label={isLiveMode() ? 'Live mode' : 'Demo mode'}>{isLiveMode() ? 'Live' : 'Demo'}</span>
          </NavLink>
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/workflow">Workflow</NavLink>
            <NavLink to="/get-verified">Get verified</NavLink>
            <NavLink to="/prove-human">Prove</NavLink>
            <NavLink to="/use-cases">Use cases</NavLink>
            <NavLink to="/for-partners">For partners</NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/get-verified" element={<GetVerified />} />
          <Route path="/prove-human" element={<ProveHuman />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/for-partners" element={<PartnerIntegration />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-inner">
            <div className="footer-section">
              <h3 className="footer-heading">Product</h3>
              <nav className="footer-nav" aria-label="Product links">
                <NavLink to="/workflow">How it works</NavLink>
                <NavLink to="/get-verified">Get verified</NavLink>
                <NavLink to="/prove-human">Prove human</NavLink>
                <NavLink to="/use-cases">Use cases</NavLink>
                <NavLink to="/for-partners">For partners</NavLink>
              </nav>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">Docs &amp; resources</h3>
              <div className="footer-links">
                <a href="https://docs.zkverify.io/overview/important-links" target="_blank" rel="noopener noreferrer">zkVerify Docs</a>
                <a href="https://docs.zkverify.io/overview/important-links" target="_blank" rel="noopener noreferrer">zkVerify (Volta)</a>
              </div>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">Legal</h3>
              <div className="footer-links">
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
              </div>
            </div>
          </div>
          <p className="footer-tagline">
            Proof-of-Human · zkVerify. Privacy-preserving authentication—no PII, no SMS vendor contracts, no bot-farm exposure. One integration; every verification is a ZK proof on zkVerify. Demo: simulated proofs; Live: real Groth16 proofs on <a href="https://docs.zkverify.io/overview/important-links" target="_blank" rel="noopener noreferrer">zkVerify Volta</a>.
          </p>
          <p className="footer-program-note" aria-hidden="true">
            Built for Thrive zkVerify Web2 program.
          </p>
        </div>
      </footer>
    </>
  )
}