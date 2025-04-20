
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdditionalNotesFieldProps {
  additionalNotes: string;
  handleChange: (field: string, value: string | boolean) => void;
}

const AdditionalNotesField = ({
  additionalNotes,
  handleChange
}: AdditionalNotesFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="additionalNotes" className="block">
        Opmerkingen <span className="text-xs font-normal text-gray-500">(optioneel)</span>
      </Label>
      <ScrollArea className="h-32 max-h-64 overflow-auto rounded-md border">
        <Textarea
          id="additionalNotes"
          value={additionalNotes}
          onChange={(e) => handleChange("additionalNotes", e.target.value)}
          placeholder="Eventuele extra informatie of wensen..."
          className="min-h-28 resize-none border-0 focus:ring-0 w-full"
          style={{ minHeight: "120px" }}
        />
      </ScrollArea>
      <p className="text-xs text-gray-500">Scrollbaar veld voor al uw vragen en opmerkingen</p>
    </div>
  );
};

export default AdditionalNotesField;
