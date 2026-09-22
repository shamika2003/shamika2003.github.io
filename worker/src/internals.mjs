// Internal helpers live outside the Worker entry module because workerd
// accepts only handler exports from its configured main module.
export const DEFAULT_MODEL = 'openai/gpt-oss-20b'
const MAX_PROMPT = 500
const MAX_HISTORY_ITEMS = 8

export function corsFor(origin, env) {
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean)
  if (!origin || !allowed.includes(origin)) return null
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  }
}

export function parseInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > MAX_PROMPT) return null
  if (body.history !== undefined && !Array.isArray(body.history)) return null
  if ((body.history || []).length > MAX_HISTORY_ITEMS) return null
  const history = []
  for (const message of body.history || []) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 850) return null
    history.push({ role: message.role, content: message.content })
  }
  if (body.stream !== undefined && typeof body.stream !== 'boolean') return null
  return { message: body.message.trim(), history, stream: body.stream === true }
}

// Groq emits standard SSE data frames. Extract text only; never forward hidden reasoning.
export function consumeSSE(frame) {
  let addition = ''
  for (const line of frame.split('\n')) {
    if (!line.startsWith('data:')) continue
    const raw = line.slice(5).trim()
    if (!raw || raw === '[DONE]') continue
    try {
      const packet = JSON.parse(raw)
      const content = packet?.choices?.[0]?.delta?.content
      if (typeof content === 'string') addition += content
    } catch { /* partial or non-JSON event */ }
  }
  return addition
}

