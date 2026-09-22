NIRA BY ELVARA — CHARACTER PATCH (TEXT ONLY)

Fixes the misleading desktop-orb self-description and replaces the stiff welcome
message with a more natural, playful NIRA opening. Keeps your live Groq model,
backend code, API key, backgrounds and portfolio layout unchanged.

FILES (paths relative to your portfolio repo):
  src/PortfolioAssistant.jsx
  worker/src/knowledge.mjs

IMPORTANT: Extract this ZIP into the *repository ROOT*, not into worker/,
not into E:\New folder\Multi-lang-project itself.

PowerShell (you can paste from any folder):
  $repo = 'E:\New folder\Multi-lang-project\shamika2003.github.io'
  $zip = Get-ChildItem "$HOME\Downloads" -Filter 'NIRA_Personality_Refinement*.zip' |
      Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $zip) { throw 'Download NIRA_Personality_Refinement.zip first.' }
  Expand-Archive -LiteralPath $zip.FullName -DestinationPath $repo -Force

To load the edited system prompt, restart Wrangler in worker/ (Ctrl+C then
npx.cmd --yes wrangler@latest dev --port 8787). Refresh the website, click the
new-conversation icon in the chat header; previous conversations are not rewritten.

Then in the repo root:
  npm.cmd run lint
  npm.cmd run build

Never put your GROQ_API_KEY in this ZIP or commit worker/.dev.vars.
