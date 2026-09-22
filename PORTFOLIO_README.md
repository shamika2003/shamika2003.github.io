# Shamika's cinematic portfolio

This package is a **complete source-code overlay** for the existing Vite + React project already in `Shamika-Portfolio`.

It includes all source files, `src/main.jsx`, eight original backgrounds at their **exact original filenames**, and a GitHub Pages workflow. It intentionally **does not replace** `.git`, `package.json`, `package-lock.json`, `vite.config.js`, or `node_modules` because these already exist on your PC.

## Original background mapping

| Section | Original filename (dark) | Original filename (light) | Copy arrangement |
|---|---|---|---|
| Hero | `ai_chip_dark.png` | `ai_chip_light.png` | Visual left, text right |
| About | `ai_girl_dark.png` | `ai_girl_light.png` | Visual right, text left |
| Projects | `code_left_dark.png` | `code_left_light.png` | Visual left, text right |
| Contact/footer | `code_right_dark.png` | `code_right_light.png` | Visual right, text left |

All eight images are in `public/backgrounds/` and are already referenced by `src/App.jsx`. **Do not rename them.**

## Install locally

With Vite stopped and PowerShell open at the existing `Shamika-Portfolio` folder:

```powershell
Expand-Archive -LiteralPath "$HOME\Downloads\Shamika_Portfolio_Cinematic.zip" -DestinationPath . -Force
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

If Chrome renamed your ZIP with `(1)`, use its exact filename or run `Ctrl+J` → Show in folder.

Open `http://localhost:5173/`.

## Publish

Only after local verification:

```powershell
git add src public index.html .github PORTFOLIO_README.md
git commit -m "Build cinematic portfolio with themed backgrounds"
git push origin main
```

On GitHub: Repository → **Settings** → **Pages** → **Build and deployment** → **Source: GitHub Actions**. The workflow deploys `dist/` on pushes to `main`.

## Notes

- Profile links in `src/App.jsx` point to the known GitHub and LinkedIn accounts.
- Individual project repository links are **not invented**. Each project row opens a real details dialog, and a separate GitHub-profile link is provided.
- This bundle intentionally doesn't include an unverified or outdated CV PDF. Add the final PDF to `public/` once finalized, then add a download button.
- Do not publish private bank data or proprietary code in any public repository.
