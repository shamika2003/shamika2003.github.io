# NIRA Agent case study — local-only add-on

This package **does not replace `src/App.jsx`**. The installer makes narrow edits to your local `App.jsx` and saves a backup. It leaves your worker, API key, images, and existing portfolio sections unchanged.

## Install

1. Download the ZIP to Downloads.
2. Open PowerShell **in your `Shamika-Portfolio` repo root** (not `worker`).
3. Run:

```powershell
$repo = (Get-Location).Path
$zip = Get-ChildItem "$HOME\Downloads" -Filter 'NIRA_CASE_STUDY_LOCAL_ADDON*.zip' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) { throw 'Download the case study ZIP first.' }
Expand-Archive -LiteralPath $zip.FullName -DestinationPath $repo -Force
node .\INSTALL_NIRA_CASE_STUDY.mjs
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Open `http://localhost:5173/#work`, select Nira Agent and click **READ CASE STUDY**. It navigates to `http://localhost:5173/#/projects/nira-agent` and uses the existing Eclipse/Halo switch. Return via **BACK TO SELECTED WORK**.

No GitHub or Cloudflare deployment required.

## Add screenshots later

Copy approved PNG files to this folder (create it if necessary):

```
public/case-studies/nira/
  desktop-overview.png
  conversation.png
  memory-workflows.png
```

They automatically replace the animated placeholders; no code editing is required. Do not include private information, credentials, customer records, or screenshots of confidential systems. Images are intentionally *not included* here.

## Safety and source ownership

The page uses only publicly described features of an **ongoing** desktop project. It does not link to unpublished project repositories or source code and makes no claim that every capability is ready for release. The small website NIRA assistant remains the existing separate web runtime.

If the installer says your `App.jsx` differs from the expected structure, it stops **without modifying** the file. Don't force the patch; share that file and we can adapt the anchors.
