/** One reload when a lazy chunk or its asset 404s. Never loops. */

export const CHUNK_RELOAD_STORAGE_KEY = "nv-chunk-reload-once";

const CHUNK_ERROR =
  /ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a binding name|Unable to preload CSS|error loading dynamically imported module|dynamically imported module|Loading CSS chunk/i;

export function isChunkLoadError(error) {
  const name =
    error && typeof error === "object" && "name" in error ? String(error.name) : "";
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : String(error ?? "");
  return CHUNK_ERROR.test(`${name} ${message}`);
}

export function claimOneReload(storage) {
  if (!storage) return false;
  try {
    if (storage.getItem(CHUNK_RELOAD_STORAGE_KEY) === "1") return false;
    storage.setItem(CHUNK_RELOAD_STORAGE_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function reloadOnceForChunkError() {
  if (typeof window === "undefined") return false;
  const claimed = claimOneReload(window.sessionStorage);
  if (!claimed) return false;
  window.location.reload();
  return true;
}

export function installChunkReloadGuard() {
  if (typeof window === "undefined") return;

  const onChunkFailure = (event) => {
    const reason = event?.reason ?? event?.payload ?? event;
    if (event?.type === "vite:preloadError" || isChunkLoadError(reason)) {
      event.preventDefault?.();
      reloadOnceForChunkError();
    }
  };

  window.addEventListener("vite:preloadError", onChunkFailure);
  window.addEventListener("unhandledrejection", onChunkFailure);

  window.setTimeout(() => {
    try {
      window.sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
    } catch {
      /* private mode */
    }
  }, 15000);
}
