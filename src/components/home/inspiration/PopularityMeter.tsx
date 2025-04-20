
import { Slider } from "@/components/ui/slider";

interface PopularityMeterProps {
  value: number;
}

export default function PopularityMeter({ value }: PopularityMeterProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Populariteit</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Slider
        value={[value]}
        max={100}
        step={1}
        disabled
        className="cursor-default"
      />
    </div>
  );
}
