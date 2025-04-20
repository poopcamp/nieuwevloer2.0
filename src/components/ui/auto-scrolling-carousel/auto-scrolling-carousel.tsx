
import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  AutoScrollingCarouselContext 
} from "@/contexts/auto-scrolling-carousel-context";
import { useAutoScrollingCarousel } from "@/hooks/use-auto-scrolling-carousel";
import { UseEmblaCarouselType } from "embla-carousel-react";

type UseCarouselParameters = Parameters<typeof useAutoScrollingCarousel>;
type CarouselOptions = UseCarouselParameters[0]['opts'];
type CarouselPlugin = Parameters<typeof useAutoScrollingCarousel>[0]['plugins'] extends (infer T)[] ? T : never;
type CarouselApi = UseEmblaCarouselType[1];

export interface AutoScrollingCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  autoplaySpeed?: number;
  showArrows?: boolean;
}

export const AutoScrollingCarousel = React.forwardRef<
  HTMLDivElement,
  AutoScrollingCarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      plugins = [],
      setApi,
      className,
      children,
      autoplaySpeed = 4000,
      showArrows = false,
      ...props
    },
    ref
  ) => {
    const carousel = useAutoScrollingCarousel({
      opts,
      plugins,
      orientation,
      setApi,
      autoplaySpeed,
    });

    return (
      <AutoScrollingCarouselContext.Provider
        value={{
          ...carousel,
          showArrows,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </AutoScrollingCarouselContext.Provider>
    );
  }
);
AutoScrollingCarousel.displayName = "AutoScrollingCarousel";
