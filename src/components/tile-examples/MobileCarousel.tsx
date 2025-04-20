
import { TileExample } from "@/types/homeContent";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import TileCard from "./TileCard";

interface MobileCarouselProps {
  examples: TileExample[];
}

const MobileCarousel = ({ examples }: MobileCarouselProps) => {
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <div className="md:hidden mt-8">
      <Carousel className="w-full">
        <CarouselContent>
          {examples.map((example) => (
            <CarouselItem key={example.id} className="basis-full md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <TileCard example={example} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="static translate-y-0 mr-2" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default MobileCarousel;
