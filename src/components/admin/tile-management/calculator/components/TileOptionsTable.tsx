
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuickCalculatorTile } from "@/utils/supabase/customTypes";

interface TileOptionsTableProps {
  tileOptions: QuickCalculatorTile[];
  isLoading: boolean;
  onEdit: (option: QuickCalculatorTile) => void;
  onDelete: (id: string) => void;
}

const TileOptionsTable = ({
  tileOptions,
  isLoading,
  onEdit,
  onDelete,
}: TileOptionsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tileOptions.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">Geen tegelopties gevonden. Voeg uw eerste tegeloptie toe.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Prijs per m²</TableHead>
            <TableHead className="w-24 text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tileOptions.map((option) => (
            <TableRow key={option.id}>
              <TableCell>{option.value}</TableCell>
              <TableCell>{option.label}</TableCell>
              <TableCell>€{option.price_per_sqm.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(option)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(option.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TileOptionsTable;
