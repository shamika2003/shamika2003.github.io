# SHAMIKA AI — SETUP FOR WINDOWS / VS CODE

## A. Install the updated site (no AI key needed)

This small ZIP intentionally contains **NO images, `.git`, `node_modules`, `package.json`, or lockfile**. It is an overlay for your existing V3 portfolio. Keep your original 8 images under `public/backgrounds/`.

In VS Code PowerShell, inside `C:\Users\user\Documents\MULTI-LANG-PROJECT\Shamika-Portfolio`:

```powershell
# Stop Vite with Ctrl+C first, then:
$zip = Get-ChildItem "$HOME\Downloads" -Filter 'Shamika_Portfolio_AI_Addon*.zip' |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) { throw 'Download the ZIP first, or locate it with Ctrl+J in Chrome.' }
Expand-Archive -LiteralPath $zip.FullName -DestinationPath (Get-Location).Path -Force
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Open http://localhost:5173/ — click the small glowing orb in the bottom-right. **It will answer from public, built-in portfolio notes even with no LLM connection.** It clearly labels this mode `PORTFOLIO GUIDE · AI OFFLINE`. No pretend AI responses.

## B. Connect an actual LLM locally

The backend uses **Cloudflare Workers** plus Groq's OpenAI-compatible chat-completions API, model `llama-3.3-70b-versatile`. Accounts, eligibility, prices, free limits and model availability may change. You need a Groq API key from https://console.groq.com/keys and a Cloudflare account. **Do not paste your API key into ChatGPT, source files, a commit or public Vite variables.**

In a SECOND VS Code PowerShell terminal:

```powershell
cd worker
Copy-Item .dev.vars.example .dev.vars
notepad .dev.vars
```

Replace the example string in `.dev.vars` with your own key, save, and close Notepad. The nested `worker/.gitignore` excludes `.dev.vars` from Git.

Start the Worker locally:

```powershell
npx.cmd wrangler dev --port 8787
```

Keep it running. In your original terminal, restart the frontend (`npm.cmd run dev`). The frontend automatically tries `http://127.0.0.1:8787` in development. Open the chatbot: it should say `AI CONNECTED` when the Worker is responding and has a configured secret. If it does not, check both terminals. The `Portfolio guide` fallback remains usable even when the Worker is offline.

## C. Publish the secure Worker and connect GitHub Pages

Only after local testing and reviewing any provider costs:

```powershell
cd worker
npx.cmd wrangler login
npx.cmd wrangler deploy
npx.cmd wrangler secret put GROQ_API_KEY
```

The CLI prompts you for the key; **do not write it in a command or GitHub file**. `secret put` can trigger an immediate redeploy. Copy the displayed Worker URL, for example `https://shamika-portfolio-ai.YOUR-SUBDOMAIN.workers.dev` (example only).

Open your portfolio repository:
`https://github.com/shamika2003/shamika2003.github.io`

Set **Settings → Secrets and variables → Actions → Variables → New repository variable**:

- Name: `VITE_PORTFOLIO_API_URL`
- Value: your public Cloudflare Worker URL (no `/chat`, no trailing slash, no API key)

The included `.github/workflows/deploy.yml` reads that URL as a public build variable. It is safe for frontend code. Push the updated site:

```powershell
cd ..
npm.cmd run lint
npm.cmd run build
git status
git add src worker .github README.md PORTFOLIO_README.md
git commit -m "Add portfolio AI assistant"
git push origin main
```

If you have changed `index.html`, include that too. Verify **Settings → Pages → Source: GitHub Actions** and wait for the Actions deployment. Visit `https://shamika2003.github.io/`.

## Maintenance

- Public knowledge: `worker/src/knowledge.mjs`. Review whenever skills, projects or links change. Never paste private banking/customer data.
- Browser assistant and fallback FAQ: `src/PortfolioAssistant.jsx`.
- Visual styling: `src/PortfolioAssistant.css`.
- Worker routing/rate limits: `worker/src/index.mjs` and `worker/wrangler.toml`.
- Automated backend tests: `node --test worker/test/worker.test.mjs`.
- For your local frontend, an optional `.env.local` can set `VITE_PORTFOLIO_API_URL=https://...` to test the deployed Worker. Do not put secrets in any `VITE_` value.

Security note: CORS is **not authentication**. The Worker has per-IP and shared 60-second Cloudflare rate-limit bindings, strict request lengths, a capped output length and timeout. Check your Groq account quota/usage and set provider-side spend limits if available. Shared IPs can be throttled together. Worker/browser information is intentionally limited to this portfolio; it is NOT an autonomous PC agent.
