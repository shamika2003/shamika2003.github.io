# Shamika Portfolio — AI assistant upgrade

An additive update to the **existing Elvara Refined V3 React/Vite portfolio**.

- Keeps the existing eight backgrounds, page layout, responsive styling and Eclipse/Halo theme.
- Adds a floating bottom-right *Shamika AI* assistant and a secure optional Cloudflare Worker backend.
- **No real Groq API key is included.** The widget starts in honest **Portfolio guide · AI offline** mode until the Worker is configured.
- The public website continues to be hosted on GitHub Pages; the Worker is deployed separately.
- No extra front-end npm packages are required.

Read `PORTFOLIO_README.md` for Windows/VS Code install instructions and AI setup.

## Security and accuracy

No private bank records, credentials or internal endpoints are included. Questions about private systems and unverified portfolio facts should be redirected to the portfolio owner's email. Frontend code never stores the provider key. The Worker validates requests, restricts browser CORS origins, uses Cloudflare rate-limit bindings and limits prompt/context sizes. **Public endpoint protection is risk reduction, not a guarantee of zero cost or abuse.**
