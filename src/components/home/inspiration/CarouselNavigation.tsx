
import { type UseEmblaCarouselType } from "embla-carousel-react";
import CarouselPagination from "./CarouselPagination";
import CarouselNavigationButton from "./CarouselNavigationButton";

interface CarouselNavigationProps {
  items: any[];
  activeIndex: number;
  carouselApi: UseEmblaCarouselType[1] | null;
}

export default function CarouselNavigation({
  items,
  activeIndex,
  carouselApi
}: CarouselNavigationProps) {
  const scrollPrev = () => carouselApi?.scrollPrev();
  const scrollNext = () => carouselApi?.scrollNext();
  
  const canScrollPrev = carouselApi?.canScrollPrev() ?? false;
  const canScrollNext = carouselApi?.canScrollNext() ?? false;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <CarouselNavigationButton 
        direction="prev"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      />
      
      <CarouselPagination items={items} activeIndex={activeIndex} />
      
      <CarouselNavigationButton 
        direction="next"
        onClick={scrollNext}
        disabled={!canScrollNext}
      />
    </div>
  );
}
