
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock } from "lucide-react";
import FormField from "./FormField";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const NotesField = ({ value, onChange }: NotesFieldProps) => {
  return (
    <FormField 
      id="notes"
      label="Opmerkingen of specifieke wensen"
      icon={<CalendarClock className="h-3.5 w-3.5 mr-1.5 text-primary-600/70" />}
    >
      <ScrollArea className="h-36 max-h-96 w-full rounded-md border border-gray-200">
        <Textarea
          id="notes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bijv. voorkeur voor tijdstip, specifieke vragen, ..."
          className="min-h-28 resize-y border-0 focus:ring-1 focus:ring-primary w-full"
          style={{ minHeight: "120px" }}
        />
      </ScrollArea>
    </FormField>
  );
};

export default NotesField;
