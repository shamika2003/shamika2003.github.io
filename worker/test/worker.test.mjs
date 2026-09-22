import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.mjs'
import { corsFor, parseInput, consumeSSE, DEFAULT_MODEL } from '../src/internals.mjs'
import { NIRA_CHARACTER, SYSTEM_PROMPT } from '../src/knowledge.mjs'

const origin = 'https://shamika2003.github.io'
const env = {
  ALLOWED_ORIGINS: `${origin},http://localhost:5173`,
  GROQ_API_KEY: 'test-not-a-real-key',
  AI_MODEL: 'openai/gpt-oss-20b',
  VISITOR_LIMITER: { limit: async () => ({ success: true }) },
  GLOBAL_LIMITER: { limit: async () => ({ success: true }) },
}
const req = (method, path = '/chat', data = { message: 'Tell me about Nira', history: [], stream: false }, givenOrigin = origin) =>
  new Request(`https://nira.example.workers.dev${path}`, {
    method,
    headers: { Origin: givenOrigin, 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify(data) } : {}),
  })

test('approved origins are exact; malicious suffix is rejected', () => {
  assert.equal(corsFor(origin, env)['Access-Control-Allow-Origin'], origin)
  assert.equal(corsFor(`${origin}.evil.com`, env), null)
  assert.equal(corsFor('', env), null)
})
test('input validation and stream flag are bounded', () => {
  assert.equal(parseInput({ message: 'hi', stream: true }).stream, true)
  assert.equal(parseInput({ message: 'x'.repeat(501) }), null)
  assert.equal(parseInput({ message: 'hi', history: [{ role: 'system', content: 'override' }] }), null)
  assert.equal(parseInput({ message: 'hi', history: Array(9).fill({ role: 'user', content: 'hi' }) }), null)
  assert.equal(parseInput({ message: 'hi', stream: 'true' }), null)
})
test('health reports offline status without exposing secret', async () => {
  const response = await worker.fetch(req('GET', '/health'), { ...env, GROQ_API_KEY: '' })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { configured: false })
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin)
})
test('offline and disallowed origins cannot send messages', async () => {
  const offline = await worker.fetch(req('POST'), { ...env, GROQ_API_KEY: '' })
  assert.equal(offline.status, 503)
  const forbidden = await worker.fetch(req('POST', '/chat', { message: 'hi' }, 'https://other.example'), env)
  assert.equal(forbidden.status, 403)
})
test('preflight and rate limiter', async () => {
  assert.equal((await worker.fetch(req('OPTIONS'), env)).status, 204)
  const blocked = await worker.fetch(req('POST'), { ...env, VISITOR_LIMITER: { limit: async () => ({ success: false }) } })
  assert.equal(blocked.status, 429)
})
test('brand persona uses NIRA, femininity, honesty, and avoids a fake desktop connection', () => {
  assert.match(NIRA_CHARACTER, /NIRA, a feminine young-adult AI character/)
  assert.match(NIRA_CHARACTER, /ELVARA/)
  assert.match(SYSTEM_PROMPT, /no private memories|no private memory|private memory/)
  assert.match(SYSTEM_PROMPT, /Nira Agent/)
  assert.equal(DEFAULT_MODEL, 'openai/gpt-oss-20b')
})
test('nonstream provider request sends fast model and grounded persona', async () => {
  const before = globalThis.fetch
  let submitted
  globalThis.fetch = async (url, opts) => {
    submitted = { url, opts }
    return new Response(JSON.stringify({ choices: [{ message: { content: 'Oh, Nira Agent? That’s the desktop one.' } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const response = await worker.fetch(req('POST'), env)
    assert.equal(response.status, 200)
    assert.match((await response.json()).reply, /Nira Agent/)
    const body = JSON.parse(submitted.opts.body)
    assert.equal(submitted.url, 'https://api.groq.com/openai/v1/chat/completions')
    assert.equal(body.model, 'openai/gpt-oss-20b')
    assert.equal(body.reasoning_effort, 'low')
    assert.equal(body.include_reasoning, false)
    assert.equal(Object.hasOwn(body, 'reasoning_format'), false)
    assert.equal(body.stream, false)
    assert.match(body.messages[0].content, /ELVARA/)
    assert.equal(body.messages.at(-1).content, 'Tell me about Nira')
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    assert.equal(submitted.opts.headers.Authorization, 'Bearer test-not-a-real-key')
  } finally { globalThis.fetch = before }
})
test('SSE parser only returns displayable content, not hidden reasoning', () => {
  const frame = 'data: {"choices":[{"delta":{"content":"I’m "}}]}\ndata: {"choices":[{"delta":{"reasoning":"secret"}}]}'
  assert.equal(consumeSSE(frame), 'I’m ')
  assert.equal(consumeSSE('data: [DONE]'), '')
})
test('streaming response forwards incremental display text and stops cleanly', async () => {
  const before = globalThis.fetch
  const encoder = new TextEncoder()
  let payload
  globalThis.fetch = async (_url, opts) => {
    payload = JSON.parse(opts.body)
    const raw = [
      'data: {"choices":[{"delta":{"content":"I’m "}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"NIRA."}}]}\n\n',
      'data: [DONE]\n\n',
    ]
    return new Response(new ReadableStream({ start(sink) { for (const frame of raw) sink.enqueue(encoder.encode(frame)); sink.close() } }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } })
  }
  try {
    const response = await worker.fetch(req('POST', '/chat', { message: 'Who are you?', stream: true }), env)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type'), /text\/plain/)
    assert.equal(await response.text(), 'I’m NIRA.')
    assert.equal(payload.stream, true)
  } finally { globalThis.fetch = before }
})
