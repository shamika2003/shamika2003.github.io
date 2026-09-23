import test from 'node:test'
import assert from 'node:assert/strict'
import { NIRA_CHARACTER, PUBLIC_PORTFOLIO, SYSTEM_PROMPT } from '../src/knowledge.mjs'

test("NIRA's primary identity is the public website instance", () => {
  assert.match(NIRA_CHARACTER, /PUBLIC PORTFOLIO WEBSITE/)
  assert.match(NIRA_CHARACTER, /NOT running as the Windows desktop/)
  assert.match(NIRA_CHARACTER, /text-only AI guide/)
  assert.match(NIRA_CHARACTER, /feminine young-adult AI character/)
  assert.match(NIRA_CHARACTER, /ELVARA/)
})
test('capability boundaries and desktop-project distinction are explicit', () => {
  assert.match(NIRA_CHARACTER, /cannot see their PC/)
  assert.match(NIRA_CHARACTER, /cannot see their PC[\s\S]*?private desktop memories/)
  assert.match(NIRA_CHARACTER, /desktop application's animated particle orb and voice/)
  assert.match(NIRA_CHARACTER, /not a physical body/)
  assert.match(NIRA_CHARACTER, /hosted language-model service/)
  assert.match(NIRA_CHARACTER, /"tell me something"/)
})
test('public facts and full system prompt stay available', () => {
  assert.match(PUBLIC_PORTFOLIO, /Nira Agent \(the DESKTOP PROJECT\)/)
  assert.match(PUBLIC_PORTFOLIO, /GlobalTrade Logistics/)
  assert.match(PUBLIC_PORTFOLIO, /TradeAI System/)
  assert.match(PUBLIC_PORTFOLIO, /CustomerMessageTool/)
  assert.match(SYSTEM_PROMPT, /PUBLIC FACTS ABOUT SHAMIKA/)
  assert.match(SYSTEM_PROMPT, /private memories/)
})
