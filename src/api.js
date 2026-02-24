/**
 * Backend API for live zkVerify mode. When VITE_API_URL is set, the app calls this
 * to submit real proofs to zkVerify via the Node server.
 */

const API_URL = import.meta.env.VITE_API_URL

export function isLiveMode() {
  return !!API_URL
}

/**
 * Submit proof to backend; backend generates Groth16 proof and submits to zkVerify Volta.
 * @param {string} secret - Credential secret (from localStorage credential).
 * @param {string|number} campaignId - Campaign/session id (e.g. "waitlist_demo_1" or 1).
 * @returns {Promise<{ success: boolean, txHash?: string, receipt?: string, error?: string }>}
 */
export async function submitProofToBackend(secret, campaignId) {
  if (!API_URL) {
    return { success: false, error: 'VITE_API_URL not set' }
  }
  const base = API_URL.replace(/\/$/, '')
  const res = await fetch(`${base}/api/submit-proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      campaignId: typeof campaignId === 'string' ? campaignId : String(campaignId)
    })
  })
  let data = {}
  try {
    const text = await res.text()
    if (text && String(text).trim().startsWith('{')) data = JSON.parse(text)
  } catch {
    // non-JSON response (e.g. 502 HTML)
  }
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText
    return { success: false, error: msg }
  }
  return {
    success: !!data.success,
    txHash: data.txHash,
    receipt: data.receipt || data.txHash,
    error: data.error
  }
}

/**
 * Call GET /api/health to check backend readiness (hasSeed, hasCircuit, mode).
 * @returns {Promise<{ ok: boolean, mode: string, hasSeed: boolean, hasCircuit: boolean }|null>}
 */
export async function healthCheck() {
  if (!API_URL) return null
  const base = API_URL.replace(/\/$/, '')
  const res = await fetch(`${base}/api/health`).catch(() => null)
  if (!res?.ok) return null
  return res.json()
}
