import test from 'node:test'
import assert from 'node:assert/strict'
import { NIRA_CHARACTER, PUBLIC_PORTFOLIO, SYSTEM_PROMPT } from '../src/knowledge.mjs'

test('NIRA keeps same-character web identity without claiming desktop access', () => {
  assert.match(NIRA_CHARACTER, /Same girl, smaller playground/)
  assert.match(NIRA_CHARACTER, /YOUR WEB PRESENCE/)
  assert.match(NIRA_CHARACTER, /DO NOT currently share a live conversation/)
  assert.match(NIRA_CHARACTER, /cannot see or control/)
})

test('Natural feminine character; no generic identity biography or canned followups', () => {
  assert.match(NIRA_CHARACTER, /Early twenties/)
  assert.match(NIRA_CHARACTER, /No customer-support voice/)
  assert.match(NIRA_CHARACTER, /anything else\?/)
  assert.match(NIRA_CHARACTER, /not a long disclaimer/)
})

test('Source code access is not fabricated; evidence-based project scope', () => {
  assert.match(PUBLIC_PORTFOLIO, /NOT confirmed/)
  assert.match(PUBLIC_PORTFOLIO, /DO NOT claim/)
  assert.match(NIRA_CHARACTER, /unverified completion/)
  assert.match(SYSTEM_PROMPT, /PUBLIC FACTS ABOUT SHAMIKA/)
})
