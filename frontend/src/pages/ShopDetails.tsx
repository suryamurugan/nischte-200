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
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API } from "@/utils/api";
import { useUser } from "@clerk/clerk-react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Navbar } from "@/components/Navbar";

interface Shop {
  _id: string;
  shopName: string;
  address: string;
  contactNo: string;
  picture: string;
  ownerId: string;
}

interface Item {
  _id: string;
  itemName: string;
  itemDescription: string;
  offerId: string;
  picture: string;
  price: string;
}

export const ShopDetails: FC = () => {
  const [shop, setShop] = useState<Shop>();
  const [items, setItems] = useState<Item[]>([]);

  const { user } = useUser();

  const { shopId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop/${shopId}/menu`);
      setItems(res.data[0].items);
    } catch (error) {
      console.log("Failed to fetch the menu itemsz");
    }
  };

  const handleItemClick = async (menuId: string) => {
    navigate(`/shop/${shopId}/menu/${menuId}`);
  };

  const isManagePage = location.pathname.includes("/shop/manage");

  useEffect(() => {
    fetchShopDetails();
    fetchMenuItems();
  }, []);
  return (
    <>
      <div className="px-6 md:px-[200px]">
        <Navbar />
        <nav className=" flex flex-col lg:flex-row items-center justify-between">
          <h1 className="font-extrabold text-black flex justify-center mt-4 mb-4 text-4xl">
            {shop?.shopName}
          </h1>
          {user?.id === shop?.ownerId && isManagePage ? (
            <div className="space-x-4 mt-2 mb-4 flex items-center justify-center">
              <Link to={`/shop/${shopId}/add-menu`}>
                <Button className="space-x-2">
                  <MdOutlineAddCircleOutline size={18} />
                  <p>Item</p>
                </Button>
              </Link>

              <Link to="/shop/update">
                <Button className="space-x-2">
                  <FaPen size={18} /> <p>Shop</p>
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="space-x-2">
                    <MdDelete size={18} /> <p>Shop</p>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
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
          ) : null}
        </nav>

        {/* Shop Display  */}
        <Card key={shop?._id} className="cursor-pointer mb-4">
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

        {/* Items Display  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <Card
                key={item?._id}
                className="cursor-pointer w-full"
                onClick={() => handleItemClick(item._id)}
              >
                <img
                  src={item?.picture}
                  alt={item?.itemName}
                  className="h-48 w-full object-cover rounded-t-md"
                />
                <CardHeader>
                  <CardTitle className="text-2xl">{item?.itemName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <span className="font-bold">{item?.itemDescription}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <p>
                    <span className="font-bold">Price: </span>: {item?.price}
                  </p>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};
