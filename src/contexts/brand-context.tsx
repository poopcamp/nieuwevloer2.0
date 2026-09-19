import React, { createContext, useContext, useMemo, useState } from "react";
import type { BrandScope } from "@/config/brands";

const STORAGE_KEY = "nv-admin-brand-scope";

function readStoredScope(): BrandScope {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (value === "all" || value === "nv" || value === "nt") return value;
  } catch {
    /* ignore */
  }
  return "all";
}

interface BrandContextType {
  scope: BrandScope;
  setScope: (scope: BrandScope) => void;
}

const BrandContext = createContext<BrandContextType>({
  scope: "all",
  setScope: () => {},
});

export const useBrandScope = () => useContext(BrandContext);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scope, setScopeState] = useState<BrandScope>(readStoredScope);

  const setScope = (next: BrandScope) => {
    setScopeState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo(() => ({ scope, setScope }), [scope]);

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};
