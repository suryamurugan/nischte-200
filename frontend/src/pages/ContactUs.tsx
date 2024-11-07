import { FC } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const ContactUs: FC = () => {
  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <p>Contact us</p>
        </div>
        <Footer />
      </div>
    </>
  );
};
