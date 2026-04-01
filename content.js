const MATRIX_DEFAULTS = {
  enabled: true,
  excludedDomains: [],
  theme: {
    glow: 0.58,
    border: 0.38,
    roundness: 12,
    scanlines: true
  }
};

let matrixObserver = null;
let matrixRefreshTimer = null;
let matrixApplied = false;

function mergeSettings(stored = {}) {
  return {
    ...MATRIX_DEFAULTS,
    ...stored,
    theme: {
      ...MATRIX_DEFAULTS.theme,
      ...(stored.theme || {})
    }
  };
}

function getHost() {
  try {
    return window.location.hostname || "";
  } catch {
    return "";
  }
}

function isSupportedPage() {
  return /^(https?:|file:)/i.test(window.location.href);
}

function matchesExcludedDomain(host, rule) {
  if (!host || !rule) return false;
  const normalized = String(rule).trim().toLowerCase();
  if (!normalized) return false;

  if (normalized.startsWith("*.")) {
    const suffix = normalized.slice(2);
    return host === suffix || host.endsWith(`.${suffix}`);
  }

  return host === normalized || host.endsWith(`.${normalized}`);
}

function isExcluded(settings) {
  const host = getHost().toLowerCase();
  return (settings.excludedDomains || []).some((rule) => matchesExcludedDomain(host, rule));
}

function parseColor(value) {
  if (!value || value === "transparent") return null;
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(",").map((p) => Number.parseFloat(p.trim()));
  if (parts.length < 3) return null;
  return {
    r: parts[0] || 0,
    g: parts[1] || 0,
    b: parts[2] || 0,
    a: Number.isFinite(parts[3]) ? parts[3] : 1
  };
}

function luminance({ r, g, b }) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function shouldRewriteBackground(style) {
  const color = parseColor(style.backgroundColor);
  if (!color || color.a < 0.08) return false;
  return luminance(color) > 74;
}

function hasBackgroundImage(style) {
  return !!style.backgroundImage && style.backgroundImage !== "none";
}

function rememberInlineStyle(el) {
  if (!el.hasAttribute("data-matrix-inline-saved")) {
    el.setAttribute("data-matrix-inline-saved", el.getAttribute("style") || "");
  }
}

function restoreInlineStyle(el) {
  if (!el.hasAttribute("data-matrix-inline-saved")) return;
  const previous = el.getAttribute("data-matrix-inline-saved") || "";
  if (previous) {
    el.setAttribute("style", previous);
  } else {
    el.removeAttribute("style");
  }
  el.removeAttribute("data-matrix-inline-saved");
}

function applyInlineMatrixPanel(el, forceText = false) {
  rememberInlineStyle(el);
  el.style.setProperty("background", "linear-gradient(180deg, var(--matrix-panel), var(--matrix-panel-2))", "important");
  el.style.setProperty("background-color", "var(--matrix-panel)", "important");
  el.style.setProperty("background-image", "linear-gradient(180deg, var(--matrix-panel), var(--matrix-panel-2))", "important");
  el.style.setProperty("border-color", "var(--matrix-border)", "important");
  el.style.setProperty("border-radius", "var(--matrix-radius-safe)", "important");
  el.style.setProperty("box-shadow", "var(--matrix-glow-shadow)", "important");
  if (forceText) {
    el.style.setProperty("color", "var(--matrix-text)", "important");
  }
}

function shouldBePanel(el, style, brightBackground) {
  const tag = el.tagName;
  const semanticTags = new Set([
    "MAIN", "SECTION", "ARTICLE", "ASIDE", "NAV", "HEADER", "FOOTER", "FORM",
    "FIELDSET", "TABLE", "DIALOG", "DETAILS", "PRE", "BLOCKQUOTE"
  ]);

  if (semanticTags.has(tag) && (brightBackground || hasBackgroundImage(style) || style.boxShadow !== "none" || style.borderStyle !== "none")) {
    return true;
  }

  const hint = `${el.id} ${el.className} ${el.getAttribute("role") || ""} ${tag}`.toLowerCase();
  if (/(card|panel|modal|dialog|sidebar|drawer|popup|content|container|wrap|box|hero|banner|toolbar|menu|tile|surface|feed|story|news|item)/i.test(hint)) {
    return true;
  }

  const rect = el.getBoundingClientRect();
  const hasSize = rect.width > 150 && rect.height > 34;
  const hasVisualBox = brightBackground || hasBackgroundImage(style) || style.boxShadow !== "none" || style.borderStyle !== "none";
  return hasSize && hasVisualBox;
}

function tagElement(el) {
  if (!(el instanceof Element)) return;
  if (el.closest("svg")) return;

  const ignored = new Set(["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "BR", "PATH", "G"]);
  if (ignored.has(el.tagName)) return;

  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return;

  const rect = el.getBoundingClientRect();
  const isFormControl = /^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  if (!isFormControl && rect.width < 6 && rect.height < 6) return;

  const brightBackground = shouldRewriteBackground(style);
  const panel = shouldBePanel(el, style, brightBackground);

  if (brightBackground) {
    el.setAttribute("data-matrix-bg-rewrite", "1");
    applyInlineMatrixPanel(el, true);
  }

  if (panel) {
    el.setAttribute("data-matrix-panel", "1");
    if (brightBackground || style.borderStyle !== "none" || style.boxShadow !== "none") {
      applyInlineMatrixPanel(el, false);
    }
  }
}

function scanTree(root) {
  if (!root) return;

  const queue = [];
  if (root instanceof Document && root.documentElement) {
    queue.push(root.documentElement);
  } else if (root instanceof ShadowRoot) {
    queue.push(...Array.from(root.children || []));
  } else if (root instanceof Element) {
    queue.push(root);
  }

  let processed = 0;
  while (queue.length && processed < 20000) {
    const current = queue.shift();
    if (!(current instanceof Element)) continue;

    tagElement(current);
    processed += 1;

    if (current.shadowRoot) {
      queue.push(...Array.from(current.shadowRoot.children || []));
    }

    if (current.children && current.children.length) {
      queue.push(...Array.from(current.children));
    }
  }
}

function applyThemeVariables(settings) {
  const root = document.documentElement;
  root.style.setProperty("--matrix-glow", String(settings.theme.glow));
  root.style.setProperty("--matrix-border-alpha", String(settings.theme.border));
  root.style.setProperty("--matrix-radius", `${settings.theme.roundness}px`);
  root.setAttribute("data-matrix-scanlines", settings.theme.scanlines ? "on" : "off");
}

function enableMatrixMode(settings) {
  if (!isSupportedPage()) return;

  const root = document.documentElement;
  root.setAttribute("data-matrix-dark-ext", "on");
  applyThemeVariables(settings);
  matrixApplied = true;

  const bodyReady = () => {
    scanTree(document);
    if (document.body) {
      document.body.setAttribute("data-matrix-body", "1");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bodyReady, { once: true });
  } else {
    bodyReady();
  }

  if (!matrixObserver) {
    matrixObserver = new MutationObserver((mutations) => {
      clearTimeout(matrixRefreshTimer);
      matrixRefreshTimer = window.setTimeout(() => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              scanTree(node);
            }
          }
        }
      }, 120);
    });

    matrixObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}

function disableMatrixMode() {
  const root = document.documentElement;
  root.removeAttribute("data-matrix-dark-ext");
  root.removeAttribute("data-matrix-scanlines");
  root.style.removeProperty("--matrix-glow");
  root.style.removeProperty("--matrix-border-alpha");
  root.style.removeProperty("--matrix-radius");
  matrixApplied = false;

  if (matrixObserver) {
    matrixObserver.disconnect();
    matrixObserver = null;
  }

  clearTimeout(matrixRefreshTimer);

  document.querySelectorAll("[data-matrix-inline-saved]").forEach((el) => {
    restoreInlineStyle(el);
  });

  document.querySelectorAll("[data-matrix-panel], [data-matrix-bg-rewrite], [data-matrix-body]").forEach((el) => {
    el.removeAttribute("data-matrix-panel");
    el.removeAttribute("data-matrix-bg-rewrite");
    el.removeAttribute("data-matrix-body");
  });
}

async function refreshMatrixMode() {
  const settings = mergeSettings(await browser.storage.local.get());
  const shouldApply = settings.enabled && !isExcluded(settings) && isSupportedPage();

  if (shouldApply) {
    enableMatrixMode(settings);
  } else if (matrixApplied) {
    disableMatrixMode();
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "MATRIX_REFRESH") {
    refreshMatrixMode();
  }
});

browser.storage.onChanged.addListener(() => {
  refreshMatrixMode();
});

refreshMatrixMode();
