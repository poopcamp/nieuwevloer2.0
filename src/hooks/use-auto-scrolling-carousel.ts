
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type UseAutoScrollingCarouselOptions = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  autoplaySpeed?: number;
};

export type UseAutoScrollingCarouselReturn = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
};

export function useAutoScrollingCarousel({
  opts,
  plugins = [],
  orientation = "horizontal",
  setApi,
  autoplaySpeed = 4000,
}: UseAutoScrollingCarouselOptions = {}): UseAutoScrollingCarouselReturn {
  // Create autoplay plugin instance with type assertion to fix TypeScript error
  const autoplayPlugin = React.useMemo(
    () => Autoplay({ delay: autoplaySpeed, stopOnInteraction: true, stopOnMouseEnter: true }) as any,
    [autoplaySpeed]
  );

  // Create a combined array of plugins
  const finalPlugins = React.useMemo(() => {
    // Spread existing plugins into a new array
    const allPlugins = [...plugins];
    
    // Add autoplay plugin
    allPlugins.push(autoplayPlugin);
    
    // Return with type assertion to resolve compatibility with useEmblaCarousel
    return allPlugins as any;
  }, [plugins, autoplayPlugin]);

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
      loop: true,
    },
    finalPlugins
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return {
    carouselRef,
    api,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    orientation,
  };
}
