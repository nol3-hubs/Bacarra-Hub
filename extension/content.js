(() => {
  // One unified extension serves the BACARRA HUB host page and its embedded
  // Received Checking iframe. The marker check prevents injection into SPX tabs.
  const isReceivedChecking = !!document.querySelector('meta[name="badoc-received-checking"]');
  const isMainBadocApp = !!document.querySelector('meta[name="badoc-main-app"]') ||
    !!document.getElementById('badocSpxBridgeInstallModal') ||
    !!document.getElementById('receivedCheckingFrame');
  const pagePath = `${location.pathname || ''}`.replace(/\\/g, '/');
  const isKnownBacarraPagesHost = location.hostname === 'nol3-hubs.github.io' &&
    /^\/Bacarra-Hub(?:\/|$)/i.test(pagePath);
  if (!isReceivedChecking && !isMainBadocApp && !isKnownBacarraPagesHost) return;

  // about:srcdoc frames inherit their parent origin. Resolve that origin before
  // checking the allowed host; the app frame itself must still be a known host.
  let bridgeContextUrl = location.href;
  if (location.protocol === 'about:') {
    try { bridgeContextUrl = document.referrer || window.parent.location.href || location.href; }
    catch (_) { bridgeContextUrl = document.referrer || location.href; }
  }
  const isAllowedHost = bridgeContextUrl.startsWith('file:') ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?\//i.test(bridgeContextUrl) ||
    /^https:\/\/nol3-hubs\.github\.io(?::\d+)?\//i.test(bridgeContextUrl) ||
    /^https:\/\/(?:[^./]+\.)+github\.io(?::\d+)?\//i.test(bridgeContextUrl);
  if (!isAllowedHost) return;
  if (window.__bacarraSpxBridgeUnifiedV72) return;
  window.__bacarraSpxBridgeUnifiedV72 = true;

  const PAGE_SOURCE = 'BADOC_SPX_BRIDGE';
  const BADOC_SOURCE = 'BADOC_PAGE';
  const VERSION = '72';
  let port = null;
  let reconnectTimer = null;
  let shuttingDown = false;
  let backgroundConfirmed = false;

  const emit = (type, data = {}) => window.postMessage({ source: PAGE_SOURCE, type, ...data }, '*');
  const scheduleReconnect = () => {
    if (shuttingDown || reconnectTimer) return;
    reconnectTimer = setTimeout(() => { reconnectTimer = null; connect(); }, 900);
  };

  function connect() {
    if (shuttingDown || port) return;
    try {
      const nextPort = chrome.runtime.connect({ name: 'BADOC_PAGE' });
      port = nextPort;
      backgroundConfirmed = false;
      nextPort.onMessage.addListener(msg => {
        if (!msg || !msg.type) return;
        if (msg.type === 'BADOC_BRIDGE_READY') {
          const backgroundVersion = Number.parseInt(String(msg.version || ''), 10);
          if (!Number.isFinite(backgroundVersion) || backgroundVersion < 72) {
            emit('BADOC_BRIDGE_DISCONNECTED', {
              version: String(msg.version || ''),
              message: `SPX BRIDGE background version ${msg.version || 'unknown'} is too old. Reload SPX BRIDGE v72.`
            });
            return;
          }
          backgroundConfirmed = true;
          emit('BADOC_BRIDGE_READY', { version: String(backgroundVersion), extensionId: chrome.runtime.id || '' });
          return;
        }
        emit(msg.type, msg);
      });
      nextPort.onDisconnect.addListener(() => {
        const reason = chrome.runtime.lastError?.message || 'Extension background did not confirm the Bridge connection.';
        if (port === nextPort) port = null;
        backgroundConfirmed = false;
        emit('BADOC_BRIDGE_DISCONNECTED', { message: reason, version: VERSION });
        scheduleReconnect();
      });
    } catch (error) {
      port = null;
      backgroundConfirmed = false;
      emit('BADOC_BRIDGE_DISCONNECTED', { message: error?.message || String(error), version: VERSION });
      scheduleReconnect();
    }
  }

  window.addEventListener('message', event => {
    if (event.source !== window) return;
    const data = event.data || {};
    if (data.source !== BADOC_SOURCE) return;

    if (data.type === 'BADOC_BRIDGE_HELLO') {
      if (backgroundConfirmed) emit('BADOC_BRIDGE_READY', { version: VERSION, extensionId: chrome.runtime.id || '' });
      else connect();
      return;
    }

    if (data.type === 'BADOC_OPEN_EXTENSIONS') {
      try {
        chrome.runtime.sendMessage({ type: 'BADOC_OPEN_EXTENSIONS' }, response => {
          if (chrome.runtime.lastError || !response?.ok) {
            emit('BADOC_SPX_ERROR', { message: chrome.runtime.lastError?.message || response?.message || 'Could not open Chrome Extensions.' });
            return;
          }
          emit('BADOC_EXTENSIONS_OPENED', {});
        });
      } catch (error) { emit('BADOC_SPX_ERROR', { message: error?.message || String(error) }); }
      return;
    }

    const supported = new Set([
      'BADOC_START_LINEHAUL_SYNC',
      'BADOC_START_DELIVERING_RECONCILE',
      'BADOC_START_PARCEL_DELIVERY_SYNC',
      'BADOC_START_RIDER_SYNC',
      'BADOC_START_PARCEL_INBOUND_SYNC',
      'BADOC_START_RECEIVED_CHECKING_INBOUND_SYNC',
      'BADOC_START_PARCEL_SECONDARY_SYNC',
      'BADOC_ABORT_SYNC'
    ]);
    if (!supported.has(data.type)) return;
    if (!port || !backgroundConfirmed) {
      const errorKind = data.type === 'BADOC_START_DELIVERING_RECONCILE' ? 'delivering-reconcile' :
        data.type === 'BADOC_START_PARCEL_SECONDARY_SYNC' ? 'parcel-secondary' :
        data.type === 'BADOC_START_PARCEL_DELIVERY_SYNC' ? 'parcel-delivery' :
        data.type === 'BADOC_START_LINEHAUL_SYNC' ? 'linehaul' :
        data.type === 'BADOC_START_RIDER_SYNC' ? 'rider' : 'parcel-inbound';
      emit('BADOC_SPX_ERROR', {
        message: 'SPX BRIDGE v72 is installed but its background service worker has not confirmed the connection. Open chrome://extensions, check for an error on SPX BRIDGE, click Reload, then refresh BACARRA HUB.',
        kind: errorKind
      });
      connect();
      return;
    }
    try {
      const payload = { type: data.type };
      if (data.type === 'BADOC_START_DELIVERING_RECONCILE') payload.trackingNumbers = Array.isArray(data.trackingNumbers) ? data.trackingNumbers.map(v => String(v || '').trim()).filter(Boolean) : [];
      if (data.type === 'BADOC_START_RIDER_SYNC') {
        payload.hubId = Number(data.hubId || 0) || 0;
        payload.hubName = String(data.hubName || '').trim();
        payload.hubCode = String(data.hubCode || '').trim();
      }
      if (data.type === 'BADOC_START_LINEHAUL_SYNC' || data.type === 'BADOC_START_PARCEL_INBOUND_SYNC' || data.type === 'BADOC_START_PARCEL_DELIVERY_SYNC') {
        for (const key of ['hubId','hubName','hubCode','trackingStatus','bulkyType','assignedStartUnix','assignedEndUnix','assignedStart','assignedEnd','assignedLabel','createdEndUnix']) {
          if (data[key] !== undefined) payload[key] = data[key];
        }
      }
      port.postMessage(payload);
    } catch (error) {
      emit('BADOC_SPX_ERROR', { message: error?.message || String(error) });
    }
  });

  window.addEventListener('beforeunload', () => {
    shuttingDown = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    try { port?.disconnect(); } catch {}
  });
  connect();
})();
