import { API } from "@/utils/api";
import { Navbar } from "@/components/Navbar";
import axios from "axios";
import { FC, TouchEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { FaMinus, FaPlus } from "react-icons/fa";

interface Item {
  _id: string;
  itemName: string;
  itemDescription: string;
  picture: string;
  offerId?: string;
  price: number;
}

export const MenuDetails: FC = () => {
  const { shopId, menuId } = useParams();
  const [item, setItem] = useState<Item>();
  const [items, setItems] = useState<Item[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [mainQuantity, setMainQuantity] = useState("1");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 2,
    align: "start",
  });
  const carouselRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { dispatch } = useCart();

  const fetchItemDetails = async () => {
    try {
      const res = await axios.get(
        `${API}/api/v1/shop/${shopId}/menu/${menuId}`
      );
      setItem(res.data);
    } catch (error) {
      console.log("Failed to get the item details");
    }
  };

  const fetchItemsofShop = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/shop/${shopId}/menu`);
      setItems(res.data[0].items);
    } catch (error) {
      console.log("Failed to fetch the items of shop");
    }
  };

  const handleUpdateMainQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      setMainQuantity("1");
      return;
    }
    setMainQuantity(newQuantity.toString());
  };

  const handleMainQuantityChange = (value: string) => {
    setMainQuantity(value);
  };

  const handleMainQuantityBlur = () => {
    if (!mainQuantity) {
      setMainQuantity("1");
      return;
    }

    const newQuantity = parseInt(mainQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setMainQuantity("1");
      toast.error("Please enter a valid quantity");
      return;
    }

    handleUpdateMainQuantity(newQuantity);
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

  const handleAddToCart = () => {
    if (item) {
      const quantity = parseInt(mainQuantity);
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: "ADD_TO_CART", payload: item });
      }

      toast.success(`${quantity} x ${item.itemName} added to your cart`, {
        duration: 2000,
      });
    }
  };

  const handleAddCarouselItemToCart = (carouselItem: Item) => {
    const quantity = parseInt(quantities[carouselItem._id] || "1");
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: carouselItem });
    }

    toast.success(`${quantity} x ${carouselItem.itemName} added to your cart`, {
      duration: 2000,
    });
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    (carouselRef.current as any).touchStartX = touch.clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!(carouselRef.current as any).touchStartX) return;

    const touch = e.touches[0];
    const diffX = (carouselRef.current as any).touchStartX - touch.clientX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        emblaApi?.scrollNext();
      } else {
        emblaApi?.scrollPrev();
      }
      (carouselRef.current as any).touchStartX = null;
    }
  };

  const handleTouchEnd = () => {
    (carouselRef.current as any).touchStartX = null;
  };

  const handleItemClickOnCarousel = (itemId: string): void => {
    console.log("first");
    try {
      navigate(`/shop/${shopId}/menu/${itemId}`);
    } catch (error) {
      console.log("Failed to get item details");
    }
  };

  useEffect(() => {
    fetchItemDetails();
    fetchItemsofShop();
  }, [menuId]);

  return (
    <div className="px-6 md:px-[200px]">
      <Navbar />
      <div className="my-4">
        <Card className="pt-2 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <img
                src={item?.picture}
                alt={`${item?.itemName}`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-extrabold text-4xl mb-4">{item?.itemName}</h1>
              <p>{item?.itemDescription}</p>
              <div className="flex items-center mt-4 space-x-4">
                <p className="text-lg font-bold">&#8377;{item?.price}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleUpdateMainQuantity(parseInt(mainQuantity) - 1)
                    }
                  >
                    <FaMinus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    value={mainQuantity}
                    onChange={(e) => handleMainQuantityChange(e.target.value)}
                    onBlur={handleMainQuantityBlur}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleUpdateMainQuantity(parseInt(mainQuantity) + 1)
                    }
                  >
                    <FaPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-start mt-4">
                <Button onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <h1 className="font-extrabold text-black mt-6 mb-3 text-2xl">
        Other Items
      </h1>
      <div
        className="w-full p-5"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Carousel ref={emblaRef} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item?._id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2"
              >
                <Card
                  className="cursor-pointer w-full h-full"
                  onClick={() => handleItemClickOnCarousel(item._id)}
                >
                  <img
                    src={item?.picture}
                    alt={item?.itemName}
                    className="h-48 w-full object-cover rounded-t-md"
                  />
                  <CardHeader>
                    <CardTitle className="text-xl">{item?.itemName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{item?.itemDescription}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="font-bold">&#8377;{item?.price}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            parseInt(quantities[item._id] || "1") - 1
                          )
                        }
                      >
                        <FaMinus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        value={quantities[item._id] || "1"}
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                        onBlur={() => handleQuantityBlur(item._id)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            parseInt(quantities[item._id] || "1") + 1
                          )
                        }
                      >
                        <FaPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={() => handleAddCarouselItemToCart(item)}>
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {items.length > 2 ? (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          ) : null}
        </Carousel>
      </div>
    </div>
  );
};
