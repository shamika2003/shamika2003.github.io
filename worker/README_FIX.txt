NIRA BY ELVARA — COMPLETE WORKER FIX (TEXT ONLY)

This archive is extracted into the portfolio REPOSITORY ROOT, not its parent and not worker/.
It supplies worker/src/index.mjs, internals.mjs, knowledge.mjs, worker/test/worker.test.mjs,
worker/wrangler.toml and worker/.dev.vars.example. It NEVER contains or overwrites .dev.vars.

The earlier errors were: an archive unpacked into the parent directory; a missing
knowledge.mjs when applying a partial patch; and a Worker main module with unsupported
named exports. This package also corrects Groq GPT-OSS 20B request settings:
include_reasoning: false replaces unsupported reasoning_format: hidden.

From PowerShell at repository ROOT, e.g.
  cd "E:\New folder\Multi-lang-project\shamika2003.github.io"
  Expand-Archive -LiteralPath $zip.FullName -DestinationPath (Get-Location).Path -Force
  cd worker
  node --test test/worker.test.mjs
  npx.cmd --yes wrangler@latest dev --port 8787

In a second terminal, npm.cmd run dev at repo root; visit http://localhost:5173/.
Check http://127.0.0.1:8787/health . Configured=true only indicates key detected,
not that an upstream LLM request succeeded. Send a test chat to verify.

Keep your existing worker/.dev.vars. Never commit or share it.

The portfolio UI is not changed, and no voice/TTS is added.
