import { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/utils/api";

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  contactNo: string;
  picture: string;
}

export const OwnerManageShop: FC = () => {
  const [shop, setShop] = useState<Shop>();
  const { shopId } = useParams();
  const navigate = useNavigate();

  const fetchShopDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop/${shopId}`);
      setShop(res?.data);
    } catch (error) {
      console.log("Failed to get the shop details");
    }
  };

  const handleDeleteShop = async () => {
    try {
      await axios.delete(`${API}/api/v1/shop/${shopId}`);
      toast.success("Shop deleted successfully!");
      navigate("/shop/manage");
    } catch (error) {
      console.log("Failed to delete shop");
      toast.error("Failed to delete shop. Please try again.");
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);
  return (
    <>
      <div className="px-6 md:px-[200px]">
        <nav className=" flex flex-col lg:flex-row items-center justify-between">
          <h1 className="font-extrabold text-black flex justify-center mt-4 mb-4 text-4xl">
            {shop?.shopName}
          </h1>
          <div className="space-x-4 mt-2 mb-4">
            <Button>
              <Link to={`/shop/${shopId}/add-menu`}>Add Item</Link>
            </Button>
            <Button>
              <Link to="/shop/update">Update Shop</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Shop</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your shop and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteShop}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </nav>

        {/* Shop Details  */}
        <Card key={shop?._id} className="cursor-pointer">
          <img
            src={shop?.picture}
            alt={shop?.shopName}
            className="h-48 w-full object-cover rounded-t-md"
          />
          <CardHeader>
            <CardTitle className="text-2xl">{shop?.shopName}</CardTitle>
            <CardDescription>{shop?.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <span className="font-bold">Contact</span>: {shop?.contactNo}
            </p>
          </CardContent>
          <CardFooter>
            <p>
              <span className="font-bold">Shop ID</span>: {shop?._id}
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
