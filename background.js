const DEFAULTS = {
  enabled: true,
  excludedDomains: [],
  theme: {
    glow: 0.58,
    border: 0.38,
    roundness: 12,
    scanlines: true
  }
};

function mergeSettings(stored = {}) {
  return {
    ...DEFAULTS,
    ...stored,
    theme: {
      ...DEFAULTS.theme,
      ...(stored.theme || {})
    }
  };
}

async function ensureDefaults() {
  const stored = await browser.storage.local.get();
  await browser.storage.local.set(mergeSettings(stored));
}

async function broadcastRefresh() {
  const tabs = await browser.tabs.query({});
  await Promise.allSettled(
    tabs
      .filter((tab) => typeof tab.id === "number")
      .map((tab) => browser.tabs.sendMessage(tab.id, { type: "MATRIX_REFRESH" }))
  );
}

browser.runtime.onInstalled.addListener(() => {
  ensureDefaults();
});

browser.runtime.onStartup.addListener(() => {
  ensureDefaults();
});

browser.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) return undefined;

  if (message.type === "MATRIX_BROADCAST_REFRESH") {
    return broadcastRefresh().then(() => ({ ok: true }));
  }

  if (message.type === "MATRIX_GET_DEFAULTS") {
    return Promise.resolve(mergeSettings({}));
  }

  return undefined;
});
