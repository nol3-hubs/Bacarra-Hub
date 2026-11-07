# BACARRA HUB KPI Source Correction

The KPI page and Dashboard KPI link now use the exact spreadsheet and tab supplied by the user:

- Spreadsheet ID: `11heDz_BMJPM9UDXEZ5nF4cyi6t53pbcLk--1cI62-70`
- Tab/GID: `816085193`
- Refresh interval: every 5 minutes
- Source URL: `https://docs.google.com/spreadsheets/d/11heDz_BMJPM9UDXEZ5nF4cyi6t53pbcLk--1cI62-70/edit?gid=816085193#gid=816085193`

The previous incorrect KPI source (`1FYolT8KgUx3Xi2nOaJAwAnpuL-_LG0732uZH0xNv-eA`, GID `288141485`) has been removed from the KPI link, primary data-source configuration, and loader fallback.

Other dashboard report integrations that use the same workbook with their own tabs (Consolidated, Pickup, Performance, and EOD) retain their own GIDs and were not changed.

The Google Sheets Visualization endpoint must be accessible to the browser. Share the spreadsheet as **Anyone with the link — Viewer** or publish the relevant tab to the web if the app reports a permission error.

## Deployment

Upload the contents of this ZIP to the repository root and commit. The service-worker cache was bumped to `bacarra-hub-pwa-v19-kpi-tab-816085193`. After deployment, reload the app with Ctrl+Shift+R.
