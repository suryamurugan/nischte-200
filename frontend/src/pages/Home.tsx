import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";

import HeoSectionPic from "../assets/nischte-hero-pic.jpg";
import { SkeletonGrid } from "@/components/SkeletonGrid";

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
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<Boolean>(false);

  const navigate = useNavigate();
  const { dispatch } = useCart();

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/v1/shop?limit=4`);
      setShops(res.data.shops);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch the shop details", error);
      setShops([]);
      setLoading(false);
    }
  };

  const fetchItemsDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/v1/shop/menu?limit=4&page=1`);
      setItems(res.data.items || []);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch the shop details", error);
      setItems([]);
      setLoading(false);
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

  const handleQuantityBlur = (itemId: string) => {
    const inputValue = quantities[itemId];
    if (!inputValue) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: "1",
      }));
      return;
    }

    const newQuantity = parseInt(inputValue);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: "1",
      }));
      toast.error("Please enter a valid quantity");
      return;
    }

    handleUpdateQuantity(itemId, newQuantity);
  };

  const handleAddToCart = (item: Item) => {
    const quantity = parseInt(quantities[item._id] || "1");
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: item });
    }

    toast.success(`${quantity} x ${item.itemName} added to your cart`, {
      duration: 2000,
    });
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

  const handleViewMoreClick = (path: string) => {
    navigate(`${path}`);
  };

  useEffect(() => {
    fetchShopDetails();
    fetchItemsDetails();
  }, []);

  return (
    <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-8 md:py-12 px-6 md:px-12 relative z-10">
            {/* Hero Content */}
            <div className="w-full md:w-[70%] space-y-4 md:space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Put Loyalty <span className="text-blue-600">First</span>
              </h1>
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl text-gray-700 font-medium">
                  Bridging the Gap Between Customers and Businesses!
                </h3>
                <h3 className="text-lg md:text-xl text-gray-600">
                  Where Customers Win and Businesses Thrive!
                </h3>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full md:w-[30%] mt-6 md:mt-0">
              <img
                src={HeoSectionPic}
                alt="Hero Section"
                className="w-full object-contain transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full -mr-24 -mt-24 opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -ml-16 -mb-16 opacity-50" />
        </div>

        {/* Shop Section  */}
        <div className="flex justify-between">
          <h1 className="font-extrabold text-black mb-4 text-2xl">Shops</h1>
          <Button
            className=" cursor-pointer"
            onClick={() => handleViewMoreClick("/shops")}
          >
            View more
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4">
          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
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
                    <span className="font-bold">Contact</span>: {shop.contactNo}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* items section */}
        <div className="mt-6">
          <div className="flex justify-between">
            <h1 className="font-extrabold text-black mb-4 text-2xl">
              New In Store
            </h1>
            <Button
              className="cursor-pointer"
              onClick={() => handleViewMoreClick("/items")}
            >
              View more
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4">
            {loading ? (
              <SkeletonGrid count={4} />
            ) : (
              items.map((item) => (
                <Card
                  key={item._id}
                  className="cursor-pointer w-full flex flex-col h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item._id, item.shopId);
                  }}
                >
                  <img
                    src={item.picture}
                    alt={item.itemName}
                    className="h-48 w-full object-cover rounded-t-md"
                  />

                  <div className="flex flex-col flex-grow">
                    <CardHeader>
                      <CardTitle className="text-xl">{item.itemName}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <p className="text-sm">{item.itemDescription}</p>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <div className="w-full">
                        <p className="font-bold mb-2">&#8377;{item.price}</p>
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-1">
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
                                handleQuantityBlur(item._id);
                              }}
                              className="w-12 text-center h-8 px-1"
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

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="h-8 text-sm"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
