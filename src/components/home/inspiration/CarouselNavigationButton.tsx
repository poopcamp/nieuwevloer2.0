
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselNavigationButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}

export default function CarouselNavigationButton({
  direction,
  onClick,
  disabled
}: CarouselNavigationButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-full border-none bg-white shadow-md hover:bg-primary-50 disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
      <span className="sr-only">
        {direction === "prev" ? "Vorige" : "Volgende"}
      </span>
    </Button>
  );
}
