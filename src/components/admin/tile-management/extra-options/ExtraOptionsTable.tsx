
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { ExtraOption } from './types';

interface ExtraOptionsTableProps {
  extraOptions: ExtraOption[];
  onEdit: (option: ExtraOption) => void;
  onDelete: (id: string) => void;
}

const ExtraOptionsTable = ({ 
  extraOptions, 
  onEdit, 
  onDelete 
}: ExtraOptionsTableProps) => {
  const handleDelete = (id: string) => {
    if (confirm("Weet je zeker dat je deze extra optie wilt verwijderen?")) {
      onDelete(id);
    }
  };

  if (extraOptions.length === 0) {
    return (
      <p className="text-center py-4 text-muted-foreground">
        Geen extra opties gevonden. Maak een nieuwe optie aan.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Naam</TableHead>
          <TableHead>Prijs (€)</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {extraOptions.map((option) => (
          <TableRow key={option.id}>
            <TableCell className="font-medium">{option.name}</TableCell>
            <TableCell>€{option.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(option)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(option.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExtraOptionsTable;
