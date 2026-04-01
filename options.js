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

function updateLabels() {
  document.getElementById("glowValue").textContent = Number(document.getElementById("glow").value).toFixed(2);
  document.getElementById("borderValue").textContent = Number(document.getElementById("border").value).toFixed(2);
  document.getElementById("roundnessValue").textContent = `${document.getElementById("roundness").value} px`;
}

async function loadSettings() {
  const settings = mergeSettings(await browser.storage.local.get());
  document.getElementById("glow").value = settings.theme.glow;
  document.getElementById("border").value = settings.theme.border;
  document.getElementById("roundness").value = settings.theme.roundness;
  document.getElementById("scanlines").checked = !!settings.theme.scanlines;
  document.getElementById("excludedDomains").value = (settings.excludedDomains || []).join("\n");
  updateLabels();
}

function collectSettings() {
  const excludedDomains = document.getElementById("excludedDomains").value
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean);

  return {
    enabled: true,
    excludedDomains,
    theme: {
      glow: Number(document.getElementById("glow").value),
      border: Number(document.getElementById("border").value),
      roundness: Number(document.getElementById("roundness").value),
      scanlines: document.getElementById("scanlines").checked
    }
  };
}

async function saveSettings() {
  const current = mergeSettings(await browser.storage.local.get());
  const next = {
    ...current,
    ...collectSettings(),
    theme: {
      ...current.theme,
      ...collectSettings().theme
    }
  };

  await browser.storage.local.set(next);
  await browser.runtime.sendMessage({ type: "MATRIX_BROADCAST_REFRESH" });
  const saveState = document.getElementById("saveState");
  saveState.textContent = "Gespeichert";
  setTimeout(() => {
    saveState.textContent = "";
  }, 1500);
}

async function resetSettings() {
  await browser.storage.local.set(DEFAULTS);
  await browser.runtime.sendMessage({ type: "MATRIX_BROADCAST_REFRESH" });
  await loadSettings();
  const saveState = document.getElementById("saveState");
  saveState.textContent = "Standardwerte geladen";
  setTimeout(() => {
    saveState.textContent = "";
  }, 1500);
}

for (const id of ["glow", "border", "roundness"]) {
  document.getElementById(id).addEventListener("input", updateLabels);
}

document.getElementById("save").addEventListener("click", saveSettings);
document.getElementById("reset").addEventListener("click", resetSettings);

loadSettings();
