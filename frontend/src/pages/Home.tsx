import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";
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
import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ifError } from "assert";

const HeroImages = [
  { name: "Banner1", path: HeroImage, id: 1 },
  { name: "Banner2", path: HeroImage2, id: 2 },
  { name: "Banner3", path: HeroImage3, id: 3 },
  { name: "Banner4", path: HeroImage4, id: 4 },
];

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  contactNo: string;
  picture: string;
}

interface Item {
  _id: string;
  itemName: string;
  itemDescription: string;
  picture: string;
  offerId?: string;
  price: number;
  shopId: string;
}

export const Home = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  const fetchShopDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop?limit=4`);
      setShops(res.data);
    } catch (error) {
      console.log("Failed to fetch the shop details", error);
    }
  };

  const fetchItemsDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop/menu?limit=4`);
      console.log("yy", res.data);
      setItems(res.data);
    } catch (error) {
      console.log("Failed to fetch the shop details", error);
    }
  };

  const handleShopDetailsClick = (shopId: string) => {
    try {
      navigate(`/shop/${shopId}`);
    } catch (error) {
      console.log("Failed to get shop details");
    }
  };

  const handleItemClick = (itemId: string, shopId: string) => {
    try {
      navigate(`/shop/${shopId}/menu/${itemId}`);
    } catch (error) {
      console.log("Failed to get item details");
    }
  };

  const handleItemViewMore = () => {};

  const handleShopViewMore = () => {
    navigate("/shops");
  };
  useEffect(() => {
    fetchShopDetails();
    fetchItemsDetails();
  }, []);

  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          {/* Hero section */}
          <div className="h-[500px] w-full relative overflow-hidden mb-5">
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

          {/* Display shop details  */}

          <div className="flex justify-between">
            <h1 className="font-extrabold text-black mb-4 text-2xl">Shops</h1>
            <p
              className="text-blue-700 cursor-pointer"
              onClick={handleShopViewMore}
            >
              View more
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 ">
            {shops &&
              shops.length > 0 &&
              shops.map((shop) => (
                <Card
                  key={shop._id}
                  className="cursor-pointer"
                  onClick={() => handleShopDetailsClick(shop._id)}
                >
                  <img
                    src={shop.picture}
                    alt={shop.shopName}
                    className="h-48 w-full object-cover rounded-t-md"
                  />
                  <CardHeader>
                    <CardTitle className="text-2xl">{shop.shopName}</CardTitle>
                    <CardDescription>{shop.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <span className="font-bold">Contact</span>:{" "}
                      {shop.contactNo}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p>
                      <span className="font-bold">Shop ID</span>: {shop._id}
                    </p>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {/* Display menu items */}
          <div className="mt-6">
            <div className="flex justify-between">
              <h1 className="font-extrabold text-black mb-4 text-2xl">
                New In Store
              </h1>
              <p className="text-blue-700" onClick={handleItemViewMore}>
                View more
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 ">
              {items &&
                items.length > 0 &&
                items.map((item) => (
                  <Card
                    className="cursor-pointer w-full h-full"
                    onClick={() => handleItemClick(item._id, item.shopId)}
                  >
                    <img
                      src={item?.picture}
                      alt={item?.itemName}
                      className="h-48 w-full object-cover rounded-t-md"
                    />
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {item?.itemName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{item?.itemDescription}</p>
                    </CardContent>
                    <CardFooter>
                      <p>
                        <span className="font-bold">Price:</span> {item?.price}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};
