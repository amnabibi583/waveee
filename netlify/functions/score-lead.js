const MODEL = 'claude-3-5-haiku-latest';
const MAX_DURATION_MS = 20000;

const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export default async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: { code: 'method_not_allowed', message: 'Use POST for lead scoring.' } });
  if (!process.env.ANTHROPIC_API_KEY) return json(503, { error: { code: 'ai_unavailable', message: 'AI scoring is not configured yet. Add ANTHROPIC_API_KEY in Netlify environment variables.' } });
  let input;
  try { input = JSON.parse(event.body || '{}'); } catch { return json(400, { error: { code: 'invalid_json', message: 'The request body must be valid JSON.' } }); }
  const { companyName, companySize, intent } = input;
  const validSizes = ['Startup', 'Mid-market', 'Enterprise']; const validIntents = ['Low', 'Medium', 'High'];
  if (typeof companyName !== 'string' || !companyName.trim() || companyName.length > 120 || !validSizes.includes(companySize) || !validIntents.includes(intent)) return json(400, { error: { code: 'invalid_input', message: 'Provide a company name, valid company size, and valid intent.' } });
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), MAX_DURATION_MS);
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL, max_tokens: 500, system: 'Return only valid JSON. No markdown, no commentary.', messages: [{ role: 'user', content: `Score this lead using only these details. Return exactly {"score":number,"tier":"Cold|Warm|Hot","recommendedAction":string,"reasons":[string,string,string],"risks":[string]}. Score must be 0-100 and reasons must have exactly 3 short strings. Company: ${companyName.trim()} | Size: ${companySize} | Intent: ${intent}` }] }) });
    if (response.status === 429) return json(429, { error: { code: 'rate_limited', message: 'The AI service is busy. Please wait and retry.' } });
    if (!response.ok) return json(502, { error: { code: 'ai_failure', message: 'The AI scoring service is temporarily unavailable.' } });
    const payload = await response.json(); const text = payload?.content?.find(item => item.type === 'text')?.text; const result = JSON.parse(text);
    if (!Number.isFinite(result.score) || result.score < 0 || result.score > 100 || !['Cold', 'Warm', 'Hot'].includes(result.tier) || typeof result.recommendedAction !== 'string' || !Array.isArray(result.reasons) || result.reasons.length !== 3 || !result.reasons.every(item => typeof item === 'string') || !Array.isArray(result.risks) || !result.risks.every(item => typeof item === 'string')) throw new Error('invalid_ai_response');
    return json(200, result);
  } catch (error) { if (error.name === 'AbortError') return json(504, { error: { code: 'timeout', message: 'The AI scoring request took too long. Please retry.' } }); if (error.message === 'invalid_ai_response' || error instanceof SyntaxError) return json(502, { error: { code: 'malformed_ai_response', message: 'The AI returned an invalid score format.' } }); return json(502, { error: { code: 'server_failure', message: 'The AI scoring service is temporarily unavailable.' } }); } finally { clearTimeout(timeout); }
}
