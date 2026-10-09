import { finalAbsolute, finalHref } from "./links.mjs";

const URL_KEYS = new Set(["url", "@id", "item"]);

function rewriteJson(value) {
  if (Array.isArray(value)) return value.map(rewriteJson);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (URL_KEYS.has(key) && typeof child === "string") {
      out[key] = finalAbsolute(child);
    } else {
      out[key] = rewriteJson(child);
    }
  }
  return out;
}

function fixAnchor(anchor) {
  if (!anchor || anchor.tagName !== "A") return;
  const href = anchor.getAttribute("href");
  if (!href) return;
  const next = finalHref(href);
  if (typeof next === "string" && next !== href) anchor.setAttribute("href", next);
}

function fixJsonScript(script) {
  if (!script || script.tagName !== "SCRIPT") return;
  if (script.getAttribute("type") !== "application/ld+json") return;
  const raw = script.textContent || "";
  if (!raw.trim()) return;
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }
  const next = JSON.stringify(rewriteJson(data));
  if (next !== raw) script.textContent = next;
}

function fixNode(node) {
  if (!node || node.nodeType !== 1) return;
  if (node.tagName === "A") fixAnchor(node);
  if (node.tagName === "SCRIPT") fixJsonScript(node);
  if (typeof node.querySelectorAll !== "function") return;
  node.querySelectorAll("a[href]").forEach(fixAnchor);
  node.querySelectorAll('script[type="application/ld+json"]').forEach(fixJsonScript);
}

/** Keep every rendered anchor and JSON-LD url on the final slash URL. */
export function installInternalLinkRewriter(doc = globalThis.document) {
  if (!doc?.documentElement || doc.documentElement.dataset.nvLinks === "1") return;
  doc.documentElement.dataset.nvLinks = "1";
  fixNode(doc);
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        fixAnchor(record.target);
        continue;
      }
      if (record.type === "characterData") {
        fixJsonScript(record.target?.parentElement);
        continue;
      }
      record.addedNodes.forEach(fixNode);
    }
  });
  observer.observe(doc.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["href"],
  });
}
