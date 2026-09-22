import { SYSTEM_PROMPT } from './knowledge.mjs'
import { DEFAULT_MODEL, corsFor, parseInput, consumeSSE } from './internals.mjs'

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MAX_BODY_BYTES = 12_000
const MAX_REPLY_CHARS = 2400
const UPSTREAM_TIMEOUT = 18_000

function json(data, status, cors = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...cors },
  })
}

function streamAnswer(upstream, controller, timer, cors) {
  const source = upstream.body
  if (!source) { clearTimeout(timer); return json({ error: 'Missing provider stream.' }, 502, cors) }
  const stream = new ReadableStream({
    async start(sink) {
      const reader = source.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()
      let buffer = ''
      let count = 0
      let closed = false
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true }).replace(/\r/g, '')
          let boundary
          while ((boundary = buffer.indexOf('\n\n')) !== -1) {
            const frame = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2)
            const text = consumeSSE(frame).slice(0, MAX_REPLY_CHARS - count)
            if (text) { count += text.length; sink.enqueue(encoder.encode(text)) }
            if (count >= MAX_REPLY_CHARS) { closed = true; break }
          }
          if (closed) break
        }
        if (!closed && buffer) {
          const last = consumeSSE(buffer).slice(0, MAX_REPLY_CHARS - count)
          if (last) sink.enqueue(encoder.encode(last))
        }
        sink.close()
      } catch {
        // If upstream fails after starting, end the partial reply cleanly.
        sink.close()
      } finally {
        clearTimeout(timer)
        controller.abort()
        try { await reader.cancel() } catch { /* already closed */ }
      }
    },
    cancel() { clearTimeout(timer); controller.abort() },
  })
  return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...cors } })
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname
    const origin = request.headers.get('Origin')
    const cors = corsFor(origin, env)
    if (request.method === 'GET' && path === '/health') return json({ configured: Boolean(env.GROQ_API_KEY) }, 200, cors || {})
    if (path !== '/chat') return json({ error: 'Not found' }, 404)
    if (!cors) return json({ error: 'Origin not allowed' }, 403)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors)
    if (!env.GROQ_API_KEY) return json({ error: 'AI not configured' }, 503, cors)
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return json({ error: 'Message too large' }, 413, cors)
    const visitor = request.headers.get('CF-Connecting-IP') || 'unknown'
    if (env.VISITOR_LIMITER && !(await env.VISITOR_LIMITER.limit({ key: visitor })).success) return json({ error: 'Please wait before sending another message.' }, 429, cors)
    if (env.GLOBAL_LIMITER && !(await env.GLOBAL_LIMITER.limit({ key: 'portfolio-nira' })).success) return json({ error: 'NIRA is busy. Try again shortly.' }, 429, cors)
    let raw
    try { raw = await request.text() } catch { return json({ error: 'Invalid request body' }, 400, cors) }
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json({ error: 'Message too large' }, 413, cors)
    let body
    try { body = JSON.parse(raw) } catch { return json({ error: 'Invalid JSON' }, 400, cors) }
    const parsed = parseInput(body)
    if (!parsed) return json({ error: 'Please enter a shorter, valid message.' }, 400, cors)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT)
    let transferred = false
    try {
      const upstream = await fetch(GROQ_CHAT_URL, {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: env.AI_MODEL || DEFAULT_MODEL,
          temperature: 0.55,
          reasoning_effort: 'low',
          include_reasoning: false,
          max_completion_tokens: 640,
          stream: parsed.stream,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...parsed.history,
            { role: 'user', content: parsed.message },
          ],
        }),
      })
      if (!upstream.ok) {
        // Do not return upstream request details or credentials to public clients.
        if (upstream.status === 429) return json({ error: 'Groq rate limit or quota reached.' }, 429, cors)
        if (upstream.status === 401 || upstream.status === 403) return json({ error: 'Groq rejected the API key or model permission.' }, 502, cors)
        if (upstream.status === 400) return json({ error: 'Groq rejected the model request (HTTP 400).' }, 502, cors)
        return json({ error: 'Groq is unavailable (HTTP ' + upstream.status + ').' }, 502, cors)
      }
      if (parsed.stream) {
        transferred = true
        return streamAnswer(upstream, controller, timer, cors)
      }
      const data = await upstream.json()
      const reply = data?.choices?.[0]?.message?.content
      if (typeof reply !== 'string' || !reply.trim()) return json({ error: 'Empty response from AI provider.' }, 502, cors)
      return json({ reply: reply.trim().slice(0, MAX_REPLY_CHARS) }, 200, cors)
    } catch {
      return json({ error: 'The AI service timed out or is unavailable.' }, 504, cors)
    } finally {
      if (!transferred) clearTimeout(timer)
    }
  },
}

