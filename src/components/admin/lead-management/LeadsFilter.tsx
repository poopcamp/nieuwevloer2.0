
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES } from "./types";

interface LeadsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
}

const LeadsFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: LeadsFilterProps) => {
  return (
    <div className="flex w-full flex-col gap-3 pt-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Zoek op naam, e-mail of telefoon…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Statusfilter">
        <button
          type="button"
          role="tab"
          aria-selected={statusFilter === null}
          onClick={() => onStatusFilterChange(null)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            statusFilter === null
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Alle
        </button>
        {LEAD_STATUSES.map((status) => (
          <button
            key={status.value}
            type="button"
            role="tab"
            aria-selected={statusFilter === status.value}
            onClick={() => onStatusFilterChange(statusFilter === status.value ? null : status.value)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              statusFilter === status.value ? status.color : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeadsFilter;
