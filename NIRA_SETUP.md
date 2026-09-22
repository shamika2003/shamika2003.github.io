# NIRA by ELVARA — fast portfolio LLM upgrade

This is a **small code-only overlay** for your existing Shamika Portfolio V3 + AI Add-on. It does not include images, the Vite starter app, `.git`, `node_modules`, or a package/lock file. Keep the existing eight backgrounds in `public/backgrounds/`.

## What changes

- The assistant is now **NIRA · ELVARA**, using a small public-website adaptation of the existing NIRA personality: young woman, independent and capable, naturally warm or witty when appropriate, never a robotic support script.
- Fast LLM: Groq `openai/gpt-oss-20b` with `reasoning_effort: low` and `max_completion_tokens: 400`, with text streamed as it arrives. Model access/pricing depends on your Groq account.
- The site remains hosted on **GitHub Pages**. A separate **Cloudflare Worker** holds the Groq key and handles public chat requests.
- If the Worker is unavailable, the widget visibly switches to **PUBLIC PORTFOLIO NOTES** rather than claiming to be the live LLM.
- The website NIRA does **not** share the Windows NIRA desktop app's personal memories, long-term emotional state, private files, PC control, voice or unrestricted tools. Matching those exactly would require securely integrating the actual NIRA runtime, not merely sharing a prompt. This is a consistent public-facing character adaptation.

## 1. Install the source files

From your existing Windows VS Code project folder:

```powershell
# Stop Vite (Ctrl+C) first.
$zip = Get-ChildItem "$HOME\Downloads" -Filter 'NIRA_by_ELVARA_fast_upgrade*.zip' |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) { throw 'Download the NIRA upgrade ZIP first.' }
Expand-Archive -LiteralPath $zip.FullName -DestinationPath (Get-Location).Path -Force

npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

The assistant appears in the bottom-right. Without the Worker, she answers from public notes, with an offline label.

## 2. Connect the REAL small LLM locally

Create a Groq API key in your own account: https://console.groq.com/keys. Do **not** paste it into ChatGPT, GitHub, any React source, or a `VITE_` variable. You may have a free allocation; quotas, model availability and provider charges can change, so inspect your account before public deployment.

Open a second VS Code terminal in the portfolio folder:

```powershell
cd worker
Copy-Item .dev.vars.example .dev.vars
notepad .dev.vars
```

Put only the actual key in `.dev.vars`, e.g. `GROQ_API_KEY="YOUR_REAL_KEY"`, then save. `worker/.gitignore` excludes this file.

Start the local backend:

```powershell
npx.cmd wrangler dev --port 8787
```

Leave it running. In your original terminal, restart the frontend:

```powershell
npm.cmd run dev
```

Open http://localhost:5173/ and ask NIRA about one of the projects. The status should change to `LIVE · FAST MODEL`. Replies should appear progressively rather than all at once.

Troubleshoot: if the browser is still in offline mode, inspect the Worker terminal. The frontend dev URL defaults to `http://127.0.0.1:8787`, which must be the same port as the Worker. You can inspect `http://127.0.0.1:8787/health` from the browser and should see `configured:true` when the local Worker sees a key. Never send anyone the actual key or `.dev.vars` file.

## 3. Publish the Worker separately

Only after you confirm model access and set any provider-side budget/usage limits:

```powershell
cd worker
npx.cmd wrangler login
npx.cmd wrangler deploy
npx.cmd wrangler secret put GROQ_API_KEY
```

The CLI prompts you privately for your Groq key. Do not put the key in a shell command, repository, or website config. Note the Worker URL shown by Cloudflare; it will normally resemble `https://shamika-portfolio-ai.YOUR-SUBDOMAIN.workers.dev`.

GitHub repository **Settings → Secrets and variables → Actions → Variables**:

- Name: `VITE_PORTFOLIO_API_URL`
- Value: **only** the public Worker URL (no API key or `/chat`).

The existing GitHub Pages deployment workflow reads this public variable at build time. Push the changed files when your local checks succeed:

```powershell
cd ..
git status
# Confirm worker/.dev.vars is NOT listed. If it is, stop and fix .gitignore.
npm.cmd run lint
npm.cmd run build
git add src/PortfolioAssistant.jsx src/PortfolioAssistant.css worker/src worker/test worker/wrangler.toml worker/.gitignore NIRA_SETUP.md
git commit -m "Give portfolio assistant NIRA identity and faster streamed LLM"
git push origin main
```

GitHub Pages stays at https://shamika2003.github.io/ after its workflow succeeds.

## 4. Testing and security

Run:

```powershell
node --test worker/test/worker.test.mjs
```

The Worker enforces exact allowed origins, request size limits, an allowlist for history roles, per-visitor and shared rate limits, a response length cap, and a deadline. CORS alone does not protect a public endpoint; set Groq usage/billing limits where available and review the Worker logs before sharing your link widely.

The knowledge file at `worker/src/knowledge.mjs` contains only public professional facts, not the desktop agent's private memory. If you later connect the actual NIRA runtime, design a separate authenticated and consent-based service instead of exposing unrestricted PC tools through a public website.
