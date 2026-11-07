# BACARRA HUB — SPX Bridge v72 connection fix

This release fixes the bridge handshake across the main dashboard and the embedded Received Checking frame.

Changes:
- Version 72 is used consistently in the extension manifest, background service worker, content script, both in-page installers, and Received Checking frame.
- Both embedded installer bundles in `index.html` now contain the exact same v72 `manifest.json`, `background.js`, and `content.js` as the `/extension` folder. This removes the stale v69 installer that was still embedded in Received Checking.
- Content script detects the Bacarra app marker by meta name (not a release-specific content value), and explicitly recognizes the `nol3-hubs.github.io/Bacarra-Hub/` project path.
- The content script reports READY only after the background service worker sends its own READY message. A disconnected or rejected port no longer looks like a successful installation.
- The Received Checking frame accepts Bridge v72 or newer and retries its handshake for up to 4 seconds instead of requiring exact version 70.
- Main app uses a 4.5-second retry window and reports site-access/background errors in the installer status.
- Service worker cache changed to `bacarra-hub-pwa-v20-bridge-v72-handshake`.

## Install
1. Replace the GitHub repository contents with the extracted full package and commit.
2. In Chrome, open `chrome://extensions`, remove the old SPX BRIDGE unpacked extension, and use **Load unpacked** with the `extension` folder from this package.
3. Make sure SPX BRIDGE is enabled and Site access includes `https://nol3-hubs.github.io`.
4. Reload SPX BRIDGE on `chrome://extensions`, then hard-refresh BACARRA HUB (`Ctrl+Shift+R`).

The extension ZIP is supplied separately with `manifest.json` at its root, so it can also be loaded unpacked directly after extraction.

Validation note: both embedded extension bundles are byte-for-byte identical to the standalone extension files.
