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

function normalizeHost(host) {
  return (host || "").trim().toLowerCase();
}

function matchesRule(host, rule) {
  const normalized = normalizeHost(rule);
  if (!normalized) return false;
  if (normalized.startsWith("*.")) {
    const suffix = normalized.slice(2);
    return host === suffix || host.endsWith(`.${suffix}`);
  }
  return host === normalized || host.endsWith(`.${normalized}`);
}

async function getActiveTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function refreshPopup() {
  const tab = await getActiveTab();
  const settings = mergeSettings(await browser.storage.local.get());
  const hostBox = document.getElementById("currentHost");
  const siteToggle = document.getElementById("siteToggle");
  const masterToggle = document.getElementById("masterToggle");
  const hint = document.getElementById("hint");
  const statusDot = document.getElementById("statusDot");

  masterToggle.checked = !!settings.enabled;
  statusDot.style.background = settings.enabled ? "rgba(76,255,136,0.92)" : "rgba(255,180,80,0.86)";

  let host = "";
  try {
    host = normalizeHost(new URL(tab?.url || "").hostname);
  } catch {
    host = "";
  }

  hostBox.textContent = host || "Nicht unterstützte oder interne Firefox-Seite";

  if (!host) {
    siteToggle.disabled = true;
    siteToggle.textContent = "Für diese Seite nicht verfügbar";
    hint.textContent = "Interne Firefox-Seiten und einige geschützte Domains können nicht verändert werden.";
    return;
  }

  const excluded = (settings.excludedDomains || []).some((rule) => matchesRule(host, rule));
  siteToggle.disabled = false;
  siteToggle.textContent = excluded ? "Für diese Domain aktivieren" : "Für diese Domain deaktivieren";
  hint.textContent = excluded
    ? "Diese Domain ist aktuell von der Matrix-Optik ausgeschlossen."
    : "Diese Domain wird aktuell mit der Matrix-Optik dargestellt.";
}

async function saveAndRefresh(updater) {
  const current = mergeSettings(await browser.storage.local.get());
  const next = updater(current);
  await browser.storage.local.set(next);
  await browser.runtime.sendMessage({ type: "MATRIX_BROADCAST_REFRESH" });
  await refreshPopup();
}

document.getElementById("masterToggle").addEventListener("change", async (event) => {
  await saveAndRefresh((current) => ({ ...current, enabled: !!event.target.checked }));
});

document.getElementById("siteToggle").addEventListener("click", async () => {
  const tab = await getActiveTab();
  let host = "";
  try {
    host = normalizeHost(new URL(tab?.url || "").hostname);
  } catch {
    host = "";
  }
  if (!host) return;

  await saveAndRefresh((current) => {
    const excludedDomains = [...(current.excludedDomains || [])];
    const index = excludedDomains.findIndex((rule) => matchesRule(host, rule));
    if (index >= 0) {
      excludedDomains.splice(index, 1);
    } else {
      excludedDomains.push(host);
      excludedDomains.sort((a, b) => a.localeCompare(b));
    }
    return { ...current, excludedDomains };
  });
});

document.getElementById("refreshNow").addEventListener("click", async () => {
  await browser.runtime.sendMessage({ type: "MATRIX_BROADCAST_REFRESH" });
  await refreshPopup();
});

document.getElementById("openOptions").addEventListener("click", async () => {
  await browser.runtime.openOptionsPage();
});

refreshPopup();
