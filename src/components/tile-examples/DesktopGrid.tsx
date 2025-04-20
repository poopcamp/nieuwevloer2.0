
import { TileExample } from "@/types/homeContent";
import TileCard from "./TileCard";

interface DesktopGridProps {
  examples: TileExample[];
}

const DesktopGrid = ({ examples }: DesktopGridProps) => {
  return (
    <div className="hidden md:block mt-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {examples.map((example) => (
          <TileCard key={example.id} example={example} />
        ))}
      </div>
    </div>
  );
};

export default DesktopGrid;
