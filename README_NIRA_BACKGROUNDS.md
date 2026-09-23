# NIRA case study — cinematic background integration

This is a **local-only, two-file replacement** for your existing NIRA case study.
It is based on `NiraCaseStudy.jsx` and `NiraCaseStudy.css` from the installed
`NIRA_CASE_STUDY_LOCAL_ADDON`, and leaves your main portfolio, theme toggle,
NIRA chat Worker, API key, and other project pages alone.

Copy the ZIP contents into the **root** of your Shamika-Portfolio project.
It overwrites only:

- `src/NiraCaseStudy.jsx`
- `src/NiraCaseStudy.css`

You have already added the matching images. Verify these filenames:

```
public/case-studies/nira/
  nira-1-dark.png
  nira-1-light.png
  nira-2-dark.png
  nira-2-light.png
  nira-3-dark.png
  nira-3-light.png
  nira-4-dark.png
  nira-4-light.png
```

Image placement:

| Area | Eclipse | Halo | Placement |
| --- | --- | --- | --- |
| Hero / NIRA identity | nira-4-dark.png | nira-4-light.png | Image right, text left |
| The idea / persona | nira-3-dark.png | nira-3-light.png | Image right, text left |
| System thinking / chip | nira-1-dark.png | nira-1-light.png | Image left, content right |
| Engineering / AI core | nira-2-dark.png | nira-2-light.png | Image right, content left |

The live **application screenshots** are NOT these backgrounds. The separate
"Inside the build" gallery keeps its placeholders until you add approved images:

```
public/case-studies/nira/
  desktop-overview.png
  conversation.png
  memory-workflows.png
```

The gallery is intentionally on a clean backdrop and the final section remains
image-free, so four cinematic sections are enough. All backgrounds switch with
the existing `.site.theme-light` class; no App.jsx changes are necessary.

## Install (Windows PowerShell, repo root)

```powershell
$repo = 'C:\Users\user\Documents\MULTI-LANG-PROJECT\Shamika-Portfolio'
$zip = Get-ChildItem "$HOME\Downloads" -Filter 'NIRA_Case_Study_4_Backgrounds*.zip' |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) { throw 'Download the new NIRA background code ZIP first.' }
Expand-Archive -LiteralPath $zip.FullName -DestinationPath $repo -Force
Set-Location $repo
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Open `http://localhost:5173/#/projects/nira-agent`; switch Eclipse / Halo.
If Wrangler's `.wrangler/tmp` causes unrelated ESLint errors, ensure
`globalIgnores` in `eslint.config.js` includes `worker/.wrangler/**`.

No GitHub push or Cloudflare deployment is needed for local testing.
