# BACARRA HUB — Dispatch / Received Checking Fix

## What changed

- Replaced the inherited Badoc-only station guard with Bacarra Hub logic.
- Main `LMHub_Received` list accepts rows where `Current Station` equals `Destination Station`, and that station is one of:
  - Bacarra Hub
  - MB Pasuquin Hub
  - MB Tamdagan Hub
  - MB Ester Hub
- `SOC_LHTransported` in the Transported / RTS section requires `Current Station = Cagayan DC` and one of the four destination hubs above.
- `Return_LMHub_Received` in the Transported / RTS section requires one of those four destination hubs.
- Removed the old SPX export-task `station_id = 3061` assertion. SPX task metadata can describe the logged-in/account station rather than the row-level destination. Downloaded CSV rows are instead checked using their explicit Current Station and Destination Station fields.
- Updated the Received Checking iframe embedded in `index.html`, plus the standalone received-checking files.
- Updated the extension version to 69.3.0 while retaining the v69 page/bridge handshake.
- Bumped the PWA cache name so browsers fetch the new Dispatch page and embedded code.

## Deployment

1. Extract this ZIP.
2. Replace the contents of the GitHub repository with all extracted files and commit.
3. Replace the files in your locally installed unpacked `extension` folder with the updated `extension` folder from this ZIP.
4. Open `chrome://extensions` and click **Reload** on SPX BRIDGE.
5. Reopen the BACARRA HUB GitHub Pages app and hard-refresh with `Ctrl + Shift + R`.

Updating only GitHub Pages is not enough for the station-task metadata fix: the SPX Bridge background service worker must also be reloaded.

## Test coverage

- Main Received rows: Bacarra Hub -> Bacarra Hub accepted.
- Main Received rows: each MB hub -> same MB hub accepted.
- Main Received with a non-matching Current/ Destination Station rejected.
- Transported rows: Cagayan DC -> each of the four destination hubs accepted.
- Transported rows with a different current station rejected.
- Return rows to each of the four destination hubs accepted; unknown destinations rejected.
- Legacy hard-coded Badoc station_id rejection removed.

The code and synthetic filter cases were checked locally. A live SPX export and sync still need to be confirmed in the user's browser after deployment.
