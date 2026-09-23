NIRA — WEBSITE IDENTITY / SYSTEM PROMPT REPLACEMENT

Only the Worker prompt changes. React UI, greeting, Groq model, API key,
rate limits, Wrangler config, and other Worker code are preserved.

1. Extract ZIP into the ROOT of your portfolio repository, NOT inside worker.
   On the home PC, the root was:
   C:\Users\user\Documents\MULTI-LANG-PROJECT\Shamika-Portfolio

2. In PowerShell:
   Set-Location 'C:\Users\user\Documents\MULTI-LANG-PROJECT\Shamika-Portfolio\worker'
   node --test test\worker.test.mjs test\nira-website-identity.test.mjs
   npx.cmd --yes wrangler@latest deploy

3. Refresh https://shamika2003.github.io/ and click NIRA's
   "new conversation" icon (the circular arrows) so stale chat history
   does not contaminate her new identity. A new public GitHub Pages build
   is NOT required for this Worker-only edit.

DO NOT enter the Groq key in the command and DO NOT upload .dev.vars.
Existing GROQ_API_KEY secret is preserved by this Worker code deploy.

NOTE: Static prompt tests verify instructions and exports, not that every
LLM response is guaranteed. Check 'who are you?', 'tell me something',
'can you control my PC?', and 'what is Nira Agent?' on the live website.
