
import * as React from "react";
import { cn } from "@/lib/utils";
import { useAutoScrollingCarouselContext } from "@/contexts/auto-scrolling-carousel-context";

export interface AutoScrollingCarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AutoScrollingCarouselContent = React.forwardRef<
  HTMLDivElement,
  AutoScrollingCarouselContentProps
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useAutoScrollingCarouselContext();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
AutoScrollingCarouselContent.displayName = "AutoScrollingCarouselContent";
