# BACARRA HUB — SPX Bridge Recognition Fix (v71)

This update addresses the app reporting that SPX BRIDGE is not installed after reinstalling it.

Changes:
- Bumped extension package to v71.
- Page content script now recognizes the BACARRA main-app meta marker by name, regardless of its release-specific content string.
- Received Checking meta marker is handled the same way.
- Added an explicit `https://nol3-hubs.github.io/*` content-script and host permission entry.
- App handshake accepts bridge versions 70 and newer, rather than requiring one exact version.
- App repeats the hello message for up to 3.5 seconds to tolerate delayed content-script injection.
- Rebuilt the embedded installer bundle from the exact extension files in `/extension`, preventing stale embedded scripts.
- Service worker cache bumped to v17.

Install both the updated website and extension. Remove the old SPX BRIDGE extension, then Load unpacked using this package's `extension` folder.
