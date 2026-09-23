NIRA by ELVARA — website identity + suggested-question fix

WHAT CHANGED
- NIRA is the same character as Shamika's desktop-agent project, currently speaking through the website, not a separate person. This does not imply shared runtime, live memory or desktop permissions.
- Introductory replies avoid repeating 'text-only web guide' or a capabilities disclaimer.
- Suggested question buttons appear only for a fresh, empty conversation. They vanish on the first keystroke OR when a suggestion/message is sent; a new conversation restores them.
- No voice, keys, Wrangler configuration or other portfolio files included.

INSTALL: From ANY PowerShell directory, with the ZIP in Downloads:
$repo = 'C:\Users\user\Documents\MULTI-LANG-PROJECT\Shamika-Portfolio'
$zip = Get-ChildItem "$HOME\Downloads" -Filter 'NIRA_Web_Portfolio_Refinement*.zip' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) { throw 'Download the ZIP first.' }
Expand-Archive -LiteralPath $zip.FullName -DestinationPath $repo -Force

TEST:
Set-Location "$repo\worker"
node --test test/worker.test.mjs test/nira-website-identity.test.mjs

DEPLOY THE BACKEND PROMPT FROM THE WORKER FOLDER:
npx.cmd --yes wrangler@latest deploy

COMMIT + PUSH FRONTEND CHANGE FROM REPO ROOT:
Set-Location $repo
npm.cmd run lint
npm.cmd run build
git add src/PortfolioAssistant.jsx worker/src/knowledge.mjs worker/test/nira-website-identity.test.mjs
git commit -m "Refine NIRA web identity and hide starter prompts during chat"
git push origin main

IMPORTANT: GitHub Pages needs the push to show the frontend change. Wrangler deploy applies the prompt to the live backend. GitHub Actions should use the existing VITE_PORTFOLIO_API_URL repository variable. Never commit worker/.dev.vars or keys.

After deploying, refresh the site (Ctrl+F5) and press NIRA's New Chat button to clear earlier misleading assistant replies.
