import { NavLink } from 'react-router-dom'

export default function PartnerIntegration() {
  const gatewayUrl = 'https://your-gateway.example.com'
  const campaignId = 'YOUR_CAMPAIGN_ID'
  const returnUrl = 'https://site-b.com/auth/callback'

  return (
    <div className="container">
      <div className="page-hero">
        <h1>For Site B: widget &amp; API example</h1>
        <p>How a partner (Site B) integrates &quot;Sign in with ZK proof&quot; so reviewers can see the widget and API shape. Site B gets only <strong>zk_identifier</strong> and verified flags—no PII.</p>
        <p className="muted text-sm mt-md">This page is for reviewers. The demo partner flow is on <NavLink to="/prove-human">Prove</NavLink>.</p>
      </div>

      {/* Flow in short */}
      <div className="card card-highlight">
        <h2>Flow (Site B integration)</h2>
        <ol className="partner-flow-list">
          <li>User on Site B clicks <strong>&quot;Sign in with ZK proof&quot;</strong> (widget or link).</li>
          <li>User is redirected to our gateway; we read their credential (localStorage on our origin), generate the ZK proof, submit to zkVerify.</li>
          <li>We redirect back to Site B with a one-time <code>token</code> (or <code>verification_id</code>) in the URL.</li>
          <li>Site B&apos;s backend calls our API with that token and receives <strong>zk_identifier</strong>, <strong>verified_human</strong>, and optional <strong>zk_receipt</strong>. Site B stores only those—no email, phone, or PII.</li>
        </ol>
      </div>

      {/* Widget example */}
      <div className="card">
        <h2>Widget example (HTML)</h2>
        <p className="muted text-sm mb-md">Site B adds a button or link that sends the user to our gateway. After verification we redirect back to <code>return_url</code> with a token.</p>
        <pre className="code-block" aria-label="Widget HTML example"><code>{`<!-- Sign in with ZK proof button -->
<a href="${gatewayUrl}/verify?campaign_id=${campaignId}&return_url=${encodeURIComponent(returnUrl)}"
   class="zk-proof-signin">
  Sign in with ZK proof
</a>`}</code></pre>
        <p className="muted text-sm mt-md">Or with JavaScript (e.g. for SPA): build the same URL and set <code>window.location.href</code>. When the user returns, read <code>?token=...</code> from the URL and call the API below.</p>
      </div>

      {/* API example */}
      <div className="card">
        <h2>API example (what Site B receives)</h2>
        <p className="muted text-sm mb-md">After redirect, Site B&apos;s backend exchanges the one-time token for the verification result. Response shape:</p>
        <p className="text-sm mb-sm"><strong>Request</strong> (example)</p>
        <pre className="code-block" aria-label="API request example"><code>{`GET ${gatewayUrl}/api/verify?token=ONE_TIME_TOKEN_FROM_REDIRECT
Authorization: Bearer PARTNER_API_KEY   # or signed request`}</code></pre>
        <p className="text-sm mb-sm mt-lg"><strong>Response</strong> (200 OK)</p>
        <pre className="code-block" aria-label="API response example"><code>{`{
  "verified": true,
  "zk_identifier": "0x7a3f...9e2",
  "verified_human": true,
  "verified_email": true,
  "age_18_plus": true,
  "zk_receipt": "0x...",
  "campaign_id": "YOUR_CAMPAIGN_ID"
}`}</code></pre>
        <p className="muted text-sm mt-md">Site B stores in its database only <strong>zk_identifier</strong>, the boolean flags, and optionally <strong>zk_receipt</strong>. Site B never receives or stores email, phone, or DOB.</p>
      </div>

      {/* Backend submit-proof (for reference) */}
      <div className="card">
        <h2>Backend: proof submission (our side)</h2>
        <p className="muted text-sm mb-md">Our backend uses <code>POST /api/submit-proof</code> (secret + campaignId) to generate the proof and submit it to zkVerify. Partners do not call this directly—they receive the result via the verify flow above.</p>
        <pre className="code-block" aria-label="Submit proof API"><code>{`POST ${gatewayUrl}/api/submit-proof
Content-Type: application/json

{ "secret": "<from credential>", "campaignId": 1 }

# 200: { "success": true, "txHash": "...", "receipt": "..." }`}</code></pre>
      </div>

      <div className="card card-highlight">
        <h2>Try the partner demo</h2>
        <p>This app&apos;s <strong>Prove</strong> page simulates Site B: a waitlist that uses &quot;Sign in with ZK proof.&quot; Get verified first (demo code <code>30322</code>), then try it.</p>
        <NavLink to="/prove-human" className="card-cta card-cta-primary">Open partner waitlist (Prove) →</NavLink>
      </div>
    </div>
  )
}
