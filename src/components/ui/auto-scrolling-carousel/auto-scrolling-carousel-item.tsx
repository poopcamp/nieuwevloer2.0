
import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAutoScrollingCarouselContext } from "@/contexts/auto-scrolling-carousel-context";

export interface AutoScrollingCarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  transitionDelay?: number;
}

export const AutoScrollingCarouselItem = React.forwardRef<
  HTMLDivElement,
  AutoScrollingCarouselItemProps
>(({ className, transitionDelay = 0, ...props }, ref) => {
  const { orientation } = useAutoScrollingCarouselContext();
  const [isVisible, setIsVisible] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, transitionDelay);
    
    return () => clearTimeout(timer);
  }, [transitionDelay]);

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        "transition-all duration-500 ease-out",
        className
      )}
      {...props}
    />
  );
});

AutoScrollingCarouselItem.displayName = "AutoScrollingCarouselItem";
