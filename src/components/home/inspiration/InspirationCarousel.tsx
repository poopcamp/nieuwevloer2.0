
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import InspirationCard from "./InspirationCard";
import CarouselNavigation from "./CarouselNavigation";
import { InspirationTile } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface InspirationCarouselProps {
  items: InspirationTile[];
}

export default function InspirationCarousel({ items }: InspirationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const isMobile = useIsMobile();

  // Update the active index when the carousel changes
  const onSelect = () => {
    if (!carouselApi) return;
    setActiveIndex(carouselApi.selectedScrollSnap());
  };

  // Set up the carousel API and event listener
  const setApi = (api: UseEmblaCarouselType[1]) => {
    setCarouselApi(api);
    api.on("select", onSelect);
  };

  // Reset carousel when viewport changes between mobile and desktop
  useEffect(() => {
    if (carouselApi) {
      carouselApi.reInit();
    }
  }, [isMobile, carouselApi]);

  return (
    <div className="relative">
      <Carousel 
        className="w-full"
        opts={{
          loop: true,
          align: "center",
          dragFree: isMobile,
          containScroll: isMobile ? "keepSnaps" : "trimSnaps"
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id} className={isMobile ? "basis-full md:basis-3/4" : "md:basis-3/4"}>
              <div className="p-1">
                <InspirationCard item={item} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselNavigation 
          items={items} 
          activeIndex={activeIndex} 
          carouselApi={carouselApi} 
        />
      </Carousel>
    </div>
  );
}
