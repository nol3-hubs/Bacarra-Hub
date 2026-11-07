# BACARRA HUB — Linehaul destinations and task snapshot fix

## Allowed Linehaul rows
- Planning Board status must be `Transporting` or `SOC_LHTransporting`.
- Current Station must be `Cagayan DC`.
- Destination Station may be one of:
  - Bacarra Hub
  - MB Pasuquin Hub
  - MB Tamdagan Hub
  - MB Ester Hub
- OID matching checks the Linehaul `OID`, `SLS TN`, and `SPX TN` against Planning Board OID / Order ID / SLS TN / SPX TN identifiers.

## Task cards
- The trip/task ID is read from the Line Haul Task ID field; `LH Trip Number` and other common trip-number header variants are also accepted.
- Each task card is built only from qualifying rows.
- After a successful import, the current task list is replaced by that import. Old task IDs missing from the latest successful import are removed, rather than appended to the new list.
- Arrival-time checkbox choices are preserved only for task IDs that still exist in the latest successful import.
- If a new import has zero qualifying rows, the existing snapshot is preserved and the import reports a warning.

## Existing systems preserved
- IndexedDB local Linehaul storage and migration.
- Supabase cloud storage and cross-device sync.
- Planning Board OID and parcel-status lookup.
- Town configuration, MB Towns, Volume Forecast and OnHold setup from the base build.

## Deployment
Extract the ZIP and upload all files/folders to the root of the GitHub repository. The service worker cache is bumped to v14.
