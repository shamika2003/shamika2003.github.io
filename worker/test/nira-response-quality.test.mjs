import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { NIRA_CHARACTER, PUBLIC_PORTFOLIO } from '../src/knowledge.mjs'
const jsx = readFileSync(new URL('../../src/PortfolioAssistant.jsx', import.meta.url), 'utf8')
const style = readFileSync(new URL('../../src/PortfolioAssistantFormatted.css', import.meta.url), 'utf8')

test('NIRA never inherits Shamika education or job in first person', () => {
  assert.match(NIRA_CHARACTER, /"I", "my", "me" refer to NIRA ONLY/)
  assert.match(NIRA_CHARACTER, /NEVER say "I am studying"/)
  assert.match(PUBLIC_PORTFOLIO, /SHAMIKA studying, NEVER NIRA/)
  assert.match(PUBLIC_PORTFOLIO, /Professional Diploma/)
  assert.match(NIRA_CHARACTER, /institution.*not.*AI specialization|word Java.*not.*AI specialization/i)
})
test('Character can discuss her persona without fabricated biological biography', () => {
  assert.match(NIRA_CHARACTER, /Early twenties/)
  assert.match(NIRA_CHARACTER, /biological birthday/)
  assert.match(NIRA_CHARACTER, /same NIRA/i)
})
test('No fabricated public code or made-up contact form', () => {
  assert.match(PUBLIC_PORTFOLIO, /DO NOT claim.*code.*GitHub/i)
  assert.match(PUBLIC_PORTFOLIO, /not a claim there is a contact FORM/)
  assert.match(NIRA_CHARACTER, /No banking\/customer info/)
})
test('Model is asked for plain text and UI renders markup safely if it slips through', () => {
  assert.match(NIRA_CHARACTER, /NOT Markdown/)
  assert.match(jsx, /renderMessageText\(message\.text\)/)
  assert.match(jsx, /return <strong key=/)
  assert.match(style, /assistant-message-text/)
  assert.doesNotMatch(jsx, /dangerouslySetInnerHTML/)
  assert.match(jsx, /messages\.length === 1 && draft\.length === 0/)
})
