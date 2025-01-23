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
import { FaMinus, FaPen, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import { IoMdEye } from "react-icons/io";

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
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [loading, setloading] = useState<Boolean>(false);

  const { dispatch } = useCart();
  const { user } = useUser();

  const { shopId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isManagePage = location.pathname.includes("/shop/manage");

  const fetchShopDetails = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${API}/api/v1/shop/${shopId}`);
      setShop(res?.data);
    } catch (error) {
      console.log("Failed to get the shop details");
    } finally {
      setloading(false);
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
      setloading(true);
      const res = await axios.get(`${API}/api/v1/shop/${shopId}/menu`);
      setItems(res.data[0].items);
    } catch (error) {
      console.log("Failed to fetch the menu itemsz");
    } finally {
      setloading(false);
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

  const handleQuantityChange = (itemId: string, value: string) => {
    setQuantities({ ...quantities, [itemId]: value });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantities((prev) => ({ ...prev, [itemId]: "1" }));
      return;
    }
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity.toString() }));
  };

  const handleQuantityBlur = (itemId: string, currentQuantity: string) => {
    const inputValue = quantities[itemId];
    if (!inputValue) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: currentQuantity,
      }));
      return;
    }

    const newQuantity = parseInt(inputValue);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: currentQuantity,
      }));
      toast.error("Please enter a valid quantity");
      return;
    }

    handleUpdateQuantity(itemId, newQuantity);
  };

  const handleAddToCart = (item: Item) => {
    const quantity = parseInt(quantities[item._id] || "1");
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          ...item,
          price: parseFloat(item.price),
          shopId: shopId || "",
          item: item.itemName,
        },
      });
    }

    toast.success(`${quantity} x ${item.itemName} added to your cart`, {
      duration: 2000,
    });
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
              <div className="flex flex-wrap sm:flex-none gap-4 mt-2 mb-4 justify-center">
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

                <Link to={`/shop/orders/${shopId}`}>
                  <Button className="space-x-2 ">
                    <IoMdEye size={18} /> <p>Orders</p>
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="space-x-2">
                      <MdDelete size={18} /> <p>Delete Shop</p>
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
          {loading ? (
            <SkeletonGrid count={1} />
          ) : (
            <Card className="cursor-pointer mb-4 flex">
              {shop && (
                <div className="w-[40%] h-[250px] sm:h-[300px]">
                  <div className="relative w-full h-full">
                    <img
                      src={shop?.picture}
                      alt={`${shop?.shopName}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-tl-md rounded-bl-md"
                    />
                  </div>
                </div>
              )}
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
          )}

          {/* Items Display  */}
          <h1 className="font-extrabold text-black  mt-4 mb-4 text-lg">
            In The House
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {items &&
              items.length > 0 &&
              items.map((item) =>
                loading ? (
                  <SkeletonGrid count={1} />
                ) : (
                  <Card
                    key={item?._id}
                    className="cursor-pointer w-full"
                    onClick={() => handleItemClick(item._id)}
                  >
                    <div className="w-full h-48 relative">
                      <img
                        src={item?.picture}
                        alt={item?.itemName}
                        className="absolute inset-0 w-full h-full object-cover rounded-tl-md rounded-tr-md"
                      />
                    </div>
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
                            ? `${item.itemDescription.substring(
                                0,
                                charLimit
                              )}...`
                            : item?.itemDescription}
                        </span>
                      </p>
                    </CardContent>
                    <CardFooter
                      className={`flex flex-col ${isManagePage ? 'flex-row justify-between items-center' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="font-bold flex items-start mb-2">&#8377;{item?.price}</p>
                      {!isManagePage && (
                        <>
                          <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateQuantity(
                                  item._id,
                                  parseInt(quantities[item._id] || "1") - 1
                                );
                              }}
                            >
                              <FaMinus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="text"
                              value={quantities[item._id] || "1"}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item._id, e.target.value);
                              }}
                              onBlur={(e) => {
                                e.stopPropagation();
                                handleQuantityBlur(
                                  item._id,
                                  quantities[item._id] || "1"
                                );
                              }}
                              className="w-16 text-center"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateQuantity(
                                  item._id,
                                  parseInt(quantities[item._id] || "1") + 1
                                );
                              }}
                            >
                              <FaPlus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex justify-start">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                          </div>
                        </>
                      )}
                      {user?.id === shop?.ownerId && isManagePage && (
                        <Button
                          className="space-x-2"
                          onClick={() => handleOfferBtnClick(item._id)}
                        >
                          <MdOutlineManageHistory size={18} />
                          <p>Offers</p>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
