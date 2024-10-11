import { Navbar } from "../components/Navbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import HeroImage from "../assets/HeroImage.png";
import HeroImage2 from "../assets/HeroImage2.jpg";
import HeroImage3 from "../assets/HeroImage3.jpg";
import HeroImage4 from "../assets/HeroImage4.jpg";

const HeroImages = [
  { name: "Banner1", path: HeroImage, id: 1 },
  { name: "Banner2", path: HeroImage2, id: 2 },
  { name: "Banner3", path: HeroImage3, id: 3 },
  { name: "Banner4", path: HeroImage4, id: 4 },
];

export const Home = () => {
  return (
    <>
      <div className="px-6 md:px-[200px]">
        <Navbar />
        {/* Hero section */}
        <div className="h-[500px] w-full relative overflow-hidden">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {HeroImages &&
                HeroImages.length > 0 &&
                HeroImages.map(({ name, id, path }) => {
                  return (
                    <CarouselItem key={id}>
                      <img src={path} alt={name} key={id} />
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </>
  );
};
