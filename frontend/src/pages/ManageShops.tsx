import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { API } from "@/utils/api";

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  contactNo: string;
  picture: string;
}

export const ManageShops: FC = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [shopDetails, setShopDetails] = useState<Shop[]>([]);

  const navigate = useNavigate();

  const fetchUserShopDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop/own/${userId}`);
      console.log("resp here: ", res.data);
      setShopDetails(res.data);
    } catch (error) {
      console.log("Failed to get shop details");
    }
  };

  const handleShopClick = async (shopId: string) => {
    navigate(`/shop/manage/${shopId}`);
  };

  useEffect(() => {
    fetchUserShopDetails();
  }, []);
  return (
    <>
      <div className="px-6 md:px-[200px]">
        <nav className="flex justify-between items-center mb-4">
          <h1 className="font-extrabold">Hey {user?.fullName}, </h1>
          <div className="space-x-3 mt-2">
            <Button>
              <Link to="/menu">Add Item</Link>
            </Button>
          </div>
        </nav>

        {shopDetails.map((shop) => (
          <Card
            key={shop._id}
            className="cursor-pointer mb-4 h-30"
            onClick={() => handleShopClick(shop._id)}
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
                <span className="font-bold">Contact</span>: {shop.contactNo}
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
    </>
  );
};
