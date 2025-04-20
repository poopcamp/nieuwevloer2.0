
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row w-full gap-2 pt-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Zoek op naam, email of telefoon..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            {statusFilter ? LEAD_STATUSES.find(s => s.value === statusFilter)?.label : 'Filter op status'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusFilterChange(null)}>
            Alle statussen
          </DropdownMenuItem>
          {LEAD_STATUSES.map((status) => (
            <DropdownMenuItem 
              key={status.value}
              onClick={() => onStatusFilterChange(status.value)}
            >
              {status.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LeadsFilter;
