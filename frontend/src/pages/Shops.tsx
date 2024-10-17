import { FC, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { API } from "@/utils/api";
import { useNavigate } from "react-router-dom";

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  contactNo: string;
  picture: string;
}

export const Shops: FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [charLimit, setCharLimit] = useState(70);

  const navigate = useNavigate();

  const fetchShopDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop`);
      setShops(res.data);
    } catch (error) {
      console.log("Failed to fetch the shop details", error);
    }
  };

  const handleShopDetailsClick = (shopId: string) => {
    navigate(`/shop/${shopId}`);
  };

  const updateCharLimit = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setCharLimit(70);
    } else if (width >= 640 && width < 1024) {
      setCharLimit(70);
    } else {
      setCharLimit(200);
    }
  };

  useEffect(() => {
    updateCharLimit();
    window.addEventListener("resize", updateCharLimit);

    return () => {
      window.removeEventListener("resize", updateCharLimit);
    };
  }, []);

  useEffect(() => {
    fetchShopDetails();
  }, []);

  return (
    <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <h1 className="font-extrabold text-black  mb-4 text-2xl">Shops</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => (
            <Card
              key={shop._id}
              className="cursor-pointer mb-4 flex"
              onClick={() => handleShopDetailsClick(shop._id)}
            >
              <div className="w-[40%]">
                <img
                  src={shop.picture}
                  alt={shop.shopName}
                  className="h-full w-full object-cover rounded-tl-md rounded-bl-md"
                />
              </div>
              <div className="w-[60%]">
                <CardHeader>
                  <CardTitle className="text-2xl">{shop.shopName}</CardTitle>
                  <span className="text-[10px] sm:text-sm">{shop._id}</span>
                  <CardDescription>
                    <p>
                      <span className="text-sm">
                        {shop.address.length > charLimit
                          ? `${shop.address.substring(0, charLimit)}...`
                          : shop?.address}
                      </span>
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <span className="font-bold text-[10px] sm:text-lg  sm:font-semibold ">
                      Contact
                    </span>
                    :
                    <span className=" pl-1 text-[10px] sm:text-sm">
                      {shop.contactNo}
                    </span>
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
