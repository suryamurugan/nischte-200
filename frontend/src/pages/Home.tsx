import { Navbar } from "../components/Navbar";
import HeroImage from "../assets/HeroImage.png";

export const Home = () => {
  return (
    <>
      <div className="px-6 md:px-[200px]">
        <Navbar />
        {/* Hero section */}
        <div className="h-[300px] w-full relative overflow-hidden">
          <img
            src={HeroImage}
            alt="Hero Image"
            className="w-full h-auto max-h-[500px] object-cover mt-3"
          />
        </div>
      </div>
    </>
  );
};
