import test from 'node:test'
import assert from 'node:assert/strict'
import { PUBLIC_PORTFOLIO, NIRA_CHARACTER, SYSTEM_PROMPT } from '../src/knowledge.mjs'

test('All featured projects remain available to NIRA', () => {
  for (const project of ['Nira Agent', 'GlobalTrade Logistics', 'TradeAI System', 'CustomerMessageTool']) {
    assert.ok(PUBLIC_PORTFOLIO.includes(project), project)
  }
  assert.match(SYSTEM_PROMPT, /PUBLIC FACTS ABOUT SHAMIKA/)
})

test('Education preserves degree vs diploma and institution vs language', () => {
  assert.match(PUBLIC_PORTFOLIO, /BSc \(Hons\) Software Engineering/)
  assert.match(PUBLIC_PORTFOLIO, /IN PROGRESS/)
  assert.match(PUBLIC_PORTFOLIO, /Professional Diploma/)
  assert.match(PUBLIC_PORTFOLIO, /NAME OF HIS INSTITUTION/)
  assert.match(PUBLIC_PORTFOLIO, /not claimed to be BSc grades/)
})

test('Prompt asks for plain text and privacy boundaries', () => {
  assert.match(NIRA_CHARACTER, /NOT Markdown/)
  assert.match(NIRA_CHARACTER, /No \*\*bold\*\*/)
  assert.match(NIRA_CHARACTER, /customer info/i)
})
