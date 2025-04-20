
import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAutoScrollingCarouselContext } from "@/contexts/auto-scrolling-carousel-context";

export interface AutoScrollingCarouselPreviousProps extends React.ComponentProps<typeof Button> {}

export const AutoScrollingCarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  AutoScrollingCarouselPreviousProps
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev, showArrows } = useAutoScrollingCarouselContext();

  if (!showArrows) return null;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
AutoScrollingCarouselPrevious.displayName = "AutoScrollingCarouselPrevious";
