
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  colors: string[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2 mb-6">
      <p className="text-sm font-medium text-gray-700">Kleurenpalet</p>
      <div className="flex space-x-2">
        {colors.map((color, colorIndex) => (
          <div 
            key={colorIndex}
            className={cn(
              "w-8 h-8 rounded-full transition-all duration-300",
              hoveredColorIndex === colorIndex && "scale-125 shadow-md"
            )}
            style={{ backgroundColor: color }}
            onMouseEnter={() => setHoveredColorIndex(colorIndex)}
            onMouseLeave={() => setHoveredColorIndex(null)}
          />
        ))}
      </div>
    </div>
  );
}
