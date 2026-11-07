# BACARRA HUB Dispatch / Transported-RTS Bridge v70 Fix

## Root cause
The page's embedded SPX Bridge installer contained an older background.js build. That embedded version rejected the completed SOC_LHTransported task whenever SPX task metadata station_id differed from the legacy Badoc station ID, even though the downloaded CSV is correctly filtered by row-level station fields in Received Checking.

## Fix
- The app installer now embeds the same extension manifest/background/content scripts as the external `extension/` folder.
- Bridge version bumped to 70.0.0 / protocol 70, and Received Checking requires v70.
- Removed the legacy task-level station_id rejection from the secondary Transported/RTS export path. SPX task metadata station_id is not used as a row destination validator.
- Row-level Dispatch filtering remains: SOC_LHTransported requires Current Station = Cagayan DC and destination in Bacarra Hub, MB Pasuquin Hub, MB Tamdagan Hub, or MB Ester Hub; Return_LMHub_Received requires one of those four destinations.
- Updated PWA cache version so GitHub Pages clients fetch the v70 page.

## Installation
1. Replace all GitHub repository files with this package and commit.
2. In the app, use Download SPX BRIDGE File to save the v70 extension folder, or replace the currently loaded unpacked extension folder with this package's `extension/` contents.
3. Open `chrome://extensions`, remove/disable the old SPX BRIDGE copy if it points to a different folder, and load/reload the v70 folder.
4. Reload the BACARRA HUB page with Ctrl+Shift+R.

The export task's SPX station_id is intentionally not treated as the parcel row's Current Station or Destination Station.
