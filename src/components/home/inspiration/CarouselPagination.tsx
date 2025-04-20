
import { cn } from "@/lib/utils";

interface CarouselPaginationProps {
  items: any[];
  activeIndex: number;
}

export default function CarouselPagination({ items, activeIndex }: CarouselPaginationProps) {
  return (
    <div className="flex gap-1">
      {items.map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-2 rounded-full transition-all",
            activeIndex === index 
              ? "w-8 bg-primary" 
              : "w-2 bg-gray-300 hover:bg-gray-400"
          )}
        />
      ))}
    </div>
  );
}
