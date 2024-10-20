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
import {
  MdOutlineAddCircleOutline,
  MdOutlineManageHistory,
} from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
  offerId?: string;
  picture: string;
  price: string;
}

export const ShopDetails: FC = () => {
  const [shop, setShop] = useState<Shop>();
  const [items, setItems] = useState<Item[]>([]);
  const [charLimit, setCharLimit] = useState(70);

  const { user } = useUser();

  const { shopId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isManagePage = location.pathname.includes("/shop/manage");

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

  const handleDeleteItem = async (itemId: string) => {
    try {
      console.log("hehe");
      await axios.delete(`${API}/api/v1/shop/${shopId}/menu/${itemId}`);
      toast.success("Item deleted successfully!");
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      navigate(`/shop/manage/${shopId}`);
    } catch (error) {
      console.log("Failed to delete the shop");
      toast.error("Failed to delete item. Please try again.");
    }
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

  const handleItemUpdate = (menuId: string) => {
    console.log("hey");
    navigate(`/shop/${shopId}/menu/${menuId}/update`);
  };

  const handleOfferBtnClick = async (menuId: string) => {
    try {
      navigate(`/shop/${shopId}/menu/${menuId}/offer`);
    } catch (error) {
      console.log("Failed to handle offer click");
    }
  };

  useEffect(() => {
    fetchShopDetails();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    updateCharLimit();
    window.addEventListener("resize", updateCharLimit);

    return () => {
      window.removeEventListener("resize", updateCharLimit);
    };
  }, []);

  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
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

                <Link to={`/shop/update/${shopId}`}>
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
                        Are you sure you want to delete this Shop?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your shop and remove your data from our servers.
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
          <Card className="cursor-pointer mb-4 flex">
            <div className="w-[40%]">
              {shop && (
                <img
                  src={shop.picture}
                  alt={shop.shopName}
                  className="h-full w-full object-cover rounded-tl-md rounded-bl-md"
                />
              )}
            </div>
            <div className="w-[60%]">
              <CardHeader>
                <CardTitle className="text-2xl">{shop?.shopName}</CardTitle>
                <span className="text-[10px] sm:text-sm">{shop?._id}</span>
                <CardDescription>
                  {(shop?.address ?? "").length > 60
                    ? `${shop?.address.substring(0, 60)}...`
                    : shop?.address || "No address available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="font-bold text-[10px] sm:text-lg  sm:font-semibold ">
                    Contact
                  </span>
                  :
                  <span className=" pl-1 text-[10px] sm:text-sm">
                    {shop?.contactNo}
                  </span>
                </p>
              </CardContent>
            </div>
          </Card>

          {/* Items Display  */}
          <h1 className="font-extrabold text-black  mt-4 mb-4 text-lg">
            In The House
          </h1>

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
                  <CardHeader className="flex-row justify-between items-center">
                    <CardTitle className="text-2xl ">
                      {item?.itemName}
                    </CardTitle>
                    <div className="space-x-2">
                      {isManagePage && shop?.ownerId === user?.id ? (
                        <>
                          <Button className="space-x-2">
                            <FaPen
                              size={18}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemUpdate(item._id);
                              }}
                            />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="space-x-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MdDelete size={18} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              onClick={(e) => e.stopPropagation()}
                            >
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this item?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your Item and remove your
                                  data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item._id);
                                  }}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <span className="text-sm">
                        {item.itemDescription.length > charLimit
                          ? `${item.itemDescription.substring(0, charLimit)}...`
                          : item?.itemDescription}
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter
                    className="flex justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p>
                      <span className="font-bold">Price: </span>: {item?.price}
                    </p>
                    <Button
                      className="space-x-2"
                      onClick={() => handleOfferBtnClick(item._id)}
                    >
                      <MdOutlineManageHistory size={18} />
                      <p>Offers</p>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
