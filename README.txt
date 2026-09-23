NIRA — Live LLM Voice Match (local-only test first)

CHANGES:
- worker/src/knowledge.mjs: the hosted LLM now follows NIRA's offline
  conversational voice while preserving the same-character/different-runtime
  distinction and the public portfolio facts.
- worker/test/nira-voice-match.test.mjs: prompt guard tests.
- worker/test/nira-website-identity.test.mjs: existing identity guard tests.

INSTALL:
1. Extract this ZIP into the ROOT of your current Shamika-Portfolio project.
   Allow overwrite for worker/src/knowledge.mjs.
2. Do not overwrite .dev.vars or edit the Groq key.
3. From Shamika-Portfolio/worker run:
   node --test test/nira-website-identity.test.mjs test/nira-voice-match.test.mjs
   npx.cmd --yes wrangler@latest dev --port 8787
4. In the other terminal run React at the portfolio root: npm.cmd run dev
5. On localhost:5173 use NIRA's New conversation / circular arrows button.
   Test: "who are you?" and "what is Nira Agent?".

Do NOT deploy Wrangler or push GitHub for this local test.
