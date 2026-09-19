import { cn } from "@/lib/utils";
import { BRANDS, type BrandScope } from "@/config/brands";
import { useBrandScope } from "@/contexts/brand-context";

interface BrandScopeTabsProps {
  nvCount?: number;
  ntCount?: number;
  className?: string;
}

const OPTIONS: { id: BrandScope; label: string }[] = [
  { id: "all", label: "Beide merken" },
  { id: "nv", label: BRANDS.nv.label },
  { id: "nt", label: BRANDS.nt.label },
];

const BrandScopeTabs = ({ nvCount, ntCount, className }: BrandScopeTabsProps) => {
  const { scope, setScope } = useBrandScope();

  const countFor = (id: BrandScope) => {
    if (nvCount === undefined && ntCount === undefined) return null;
    if (id === "nv") return nvCount ?? 0;
    if (id === "nt") return ntCount ?? 0;
    return (nvCount ?? 0) + (ntCount ?? 0);
  };

  return (
    <div
      role="tablist"
      aria-label="Merkfilter"
      className={cn(
        "inline-flex rounded-lg border border-white/10 bg-black/20 p-1 text-sm",
        className
      )}
    >
      {OPTIONS.map((option) => {
        const active = scope === option.id;
        const count = countFor(option.id);
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setScope(option.id)}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-200 hover:text-white"
            )}
          >
            {option.label}
            {count !== null && (
              <span className={cn("ml-1.5 tabular-nums", active ? "text-slate-500" : "text-slate-400")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BrandScopeTabs;
