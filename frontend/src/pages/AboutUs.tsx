import { FC } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MdOutlineEmail } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";

export const AboutUs: FC = () => {
  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <h1 className="text-xl font-extrabold md:text-4xl my-2 ">
            Our Mission
          </h1>
          <p className="mt-2 sm:text-lg">
            Our Mission At Nischte, we believe in rewarding loyalty and
            nurturing relationships between businesses and their customers. Our
            mission is to empower shop owners with the tools to offer meaningful
            rewards and promotions to their loyal customers. We bridge the gap
            between businesses and their most valued patrons, fostering a sense
            of community and appreciation.
          </p>
          <h1 className="text-xl font-extrabold md:text-4xl my-2 ">
            What We Do
          </h1>
          <p className="sm:text-lg">
            Our loyalty platform enables shop owners to:
          </p>
          <ul className="list-disc sm:text-lg">
            <li className="mt-3">
              Design promotions that resonate with their loyal customers,
              encouraging them to return and engage more deeply with their
              brand.
            </li>
            <li>
              Build a loyal customer base that feels valued and recognized,
              strengthening the bond between the business and its patrons.
            </li>
            <li>
              Utilize our innovative tools and insights to boost sales and
              enhance customer retention, ensuring long-term success.
            </li>
          </ul>
          <p className="sm:text-lg mt-3">
            Join us on our journey to revolutionize customer loyalty, one
            rewarding experience at a time!
          </p>
          <h1 className="text-xl font-extrabold md:text-4xl my-2 ">
            Contact us
          </h1>
          <div className="flex items-center space-x-2">
            <p>
              <MdOutlineEmail />
            </p>
            <p>communities.atria@gmail.com</p>
          </div>
          <div className="flex items-center space-x-2">
            <p>
              <CiGlobe />
            </p>
            <p>cialabs.org</p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
