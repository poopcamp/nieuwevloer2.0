
import * as React from "react";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { UseAutoScrollingCarouselReturn } from "@/hooks/use-auto-scrolling-carousel";

type CarouselApi = UseEmblaCarouselType[1];

export type AutoScrollingCarouselContextProps = UseAutoScrollingCarouselReturn & {
  showArrows?: boolean;
};

export const AutoScrollingCarouselContext = React.createContext<AutoScrollingCarouselContextProps | null>(null);

export function useAutoScrollingCarouselContext() {
  const context = React.useContext(AutoScrollingCarouselContext);

  if (!context) {
    throw new Error("useAutoScrollingCarouselContext must be used within a <AutoScrollingCarousel />");
  }

  return context;
}
