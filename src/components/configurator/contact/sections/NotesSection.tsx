
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesSectionProps {
  additionalNotes: string;
  handleChange: (field: string, value: string | boolean) => void;
}

const NotesSection = ({ additionalNotes, handleChange }: NotesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="additionalNotes" className="block">Opmerkingen</Label>
      <ScrollArea className="h-32 max-h-64 overflow-auto rounded-md border">
        <Textarea
          id="additionalNotes"
          value={additionalNotes}
          onChange={(e) => handleChange("additionalNotes", e.target.value)}
          placeholder="Eventuele extra informatie of wensen..."
          className="border-0 min-h-28 focus:ring-0 resize-none w-full"
          style={{ minHeight: "120px" }}
        />
      </ScrollArea>
      <p className="text-xs text-gray-500">Scrollbaar veld voor al uw vragen en opmerkingen</p>
    </div>
  );
};

export default NotesSection;
