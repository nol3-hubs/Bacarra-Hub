# BACARRA HUB – Volume Forecast and OnHold Update

## Volume Forecast
- Removed the inherited Badoc/Pinili 57-town allowlist.
- Forecast eligibility now uses the same configured Bacarra, Vintar, Pasuquin and MB Town resolver as Parcel Count.
- MB TOWNS remain a separate dashboard section but are included under Pasuquin for parcel classification and forecasting.
- Moved the forecast filter preference key to a Bacarra-specific v2 key so old Badoc checkbox exclusions are not reused.

## OnHold
- Disconnected the OnHold Google Sheets loader and the unmatched Column F popup.
- OnHold is now derived from uploaded Parcel Count row status values (`OnHold`, `On Hold`, `LMHub_OnHold`, `LMHub_On_Hold`, etc.).
- Distinct SPX TNs are counted once for the OnHold KPI.
- Town counts, Riders Data, Daily History, CFR cleared totals and operation KPI now use uploaded row status rather than Google Sheets.
- `window.BACARRA_ONHOLD_SHEET_URL` is intentionally blank for a future user-provided sheet URL.
- Other Google Sheets connections are not changed.

## Deployment
Extract this ZIP and upload all files/folders to the root of the GitHub repository. The service-worker cache is bumped to v13.
