# Bacarra Hub Dashboard

The production dashboard is served from the repository root (`index.html`) through GitHub Pages. The old nested `BACARRA_HUB_App` copy has been removed so there is one authoritative build.

## Project structure

- `index.html` — dashboard UI, embedded Dispatch / Received Checking page, and the extension installer bundle.
- `extension/` — installable Manifest V3 extension. Current package version: **74.1.0**.
- `extension/pod-checker/` — POD/POOH validation UI and SPX page bridge. Its `recipient_info` API usage is for delivery status, on-hold reason, ePOD tier, and proof-of-contact evidence; it does not display Dispatch recipient names.
- `sw.js`, `manifest.webmanifest`, `icons/` — PWA service worker, install manifest, and active app icons.
- `bacarra-*.json`, `BACARRA_*.csv`, and `BACARRA_*.json` — retained Bacarra town reference/configuration data.
- `README_TOWN_FILTER_LOGIC.md` — town grouping, alias, and parcel classification rules.
- `FIREBASE-SETUP.md` — Firebase Realtime Database setup notes.

## Install the browser extension

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked** and choose the repository's `extension/` folder.
4. Confirm the extension is enabled, then reload the Bacarra Hub dashboard.

The dashboard's extension installer packages the files from `extension/`; the embedded bundle is kept synchronized with the standalone folder. The Dispatch recipient-name column, recipient-name search, and automatic recipient-name lookup have been removed from both the dashboard and the extension.

## Deployment and cache

Publish the repository root using GitHub Pages. The service-worker cache is currently `bacarra-hub-pwa-v23-cleanup-bridge-v74-1`. After deployment, hard-refresh the dashboard (`Ctrl+Shift+R`). Reload the unpacked extension after replacing its files.

## Backend

The dashboard uses Firebase Realtime Database under the `/bacarra` root. See [FIREBASE-SETUP.md](FIREBASE-SETUP.md) before changing Firebase configuration or rules.
