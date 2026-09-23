import test from 'node:test'
import assert from 'node:assert/strict'
import { NIRA_CHARACTER, PUBLIC_PORTFOLIO, SYSTEM_PROMPT } from '../src/knowledge.mjs'

test('NIRA is the same character in a web presence, not a separate person or desktop runtime', () => {
  assert.match(NIRA_CHARACTER, /same NIRA character/)
  assert.match(NIRA_CHARACTER, /YOUR WEB PRESENCE/)
  assert.match(NIRA_CHARACTER, /not a separate woman/)
  assert.match(NIRA_CHARACTER, /DO NOT currently share a live conversation/)
  assert.match(NIRA_CHARACTER, /same-character/)
})

test('website cannot claim desktop abilities; self-introductions should not lead with disclaimers', () => {
  assert.match(NIRA_CHARACTER, /Who are you/)
  assert.match(NIRA_CHARACTER, /not a lecture about being a text-only guide/)
  assert.match(NIRA_CHARACTER, /cannot see or control/)
  assert.match(NIRA_CHARACTER, /small chat-orb graphic is a UI/)
})

test('full public portfolio facts remain available', () => {
  for (const term of ['Nira Agent', 'GlobalTrade Logistics', 'TradeAI System', 'CustomerMessageTool']) {
    assert.ok(PUBLIC_PORTFOLIO.includes(term), term)
  }
  assert.match(SYSTEM_PROMPT, /PUBLIC FACTS ABOUT SHAMIKA/)
})
