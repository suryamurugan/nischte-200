import { API } from "@/utils/api";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  contactNo: string;
  picture: string;
}

export const ShopDetails: FC = () => {
  const { shopId } = useParams();

  const [shopDetails, setShopDetails] = useState<Shop>();

  console.log(shopId);

  const fetchShopDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop/${shopId}`);
      setShopDetails(res?.data);
    } catch (error) {
      console.log("failed to get the shop Details");
    }
  };

  console.log("res :", shopDetails);

  useEffect(() => {
    fetchShopDetails();
  }, []);
  return (
    <>
      <div className="px-6 md:px-[200px]">
        <h1 className="font-extrabold text-black flex justify-center mt-4 mb-4 text-4xl">
          Shop Details
        </h1>
        <Card key={shopDetails?._id} className="cursor-pointer">
          <img
            src={shopDetails?.picture}
            alt={shopDetails?.shopName}
            className="h-48 w-full object-cover rounded-t-md"
          />
          <CardHeader>
            <CardTitle className="text-2xl">{shopDetails?.shopName}</CardTitle>
            <CardDescription>{shopDetails?.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <span className="font-bold">Contact</span>:{" "}
              {shopDetails?.contactNo}
            </p>
          </CardContent>
          <CardFooter>
            <p>
              <span className="font-bold">Shop ID</span>: {shopDetails?._id}
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
