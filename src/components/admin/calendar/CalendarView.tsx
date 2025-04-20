
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { nl } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export const CalendarView = ({ selectedDate, onSelectDate }: CalendarViewProps) => {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Kalender</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className="rounded-md border"
            locale={nl}
          />
        </div>
      </CardContent>
    </Card>
  );
};
