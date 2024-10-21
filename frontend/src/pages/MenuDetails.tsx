import { API } from "@/utils/api";
import { Navbar } from "@/components/Navbar";
import axios from "axios";
import {
  ChangeEvent,
  FC,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [quantity, setQuantity] = useState<number>(1);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 2,
    align: "start",
  });
  const carouselRef = useRef<HTMLDivElement>(null);

  const { state, dispatch } = useCart();

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

  const handleAddToCart = () => {
    if (item) {
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: "ADD_TO_CART", payload: item });
      }

      toast.success(`${quantity} x ${item.itemName} added to your cart`, {
        duration: 2000,
      });
    }
  };

  const handleAddCarouselItemToCart = (carouselItem: Item) => {
    dispatch({ type: "ADD_TO_CART", payload: carouselItem });

    toast.success(`${quantity} x ${carouselItem.itemName} added to your cart`, {
      duration: 2000,
    });
  };

  useEffect(() => {
    fetchItemDetails();
    fetchItemsofShop();
  }, []);

  const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
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

  return (
    <>
      {/* Remove top padding: Reminder   */}
      <div className="px-6 md:px-[200px]">
        <Navbar />
        {/* Display menu items  */}
        <div className="my-4">
          <Card className="pt-2 pb-2">
            {/* item display wrapper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <img
                  src={item?.picture}
                  alt={`${item?.itemName}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="font-extrabold text-4xl mb-4">
                  {item?.itemName}
                </h1>
                <p>{item?.itemDescription}</p>
                <div className="flex items-center mt-4 space-x-4">
                  {/* TODO: Need to add the price symbol  */}
                  <p className="text-lg font-bold">{item?.price}</p>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="quantity" className="font-semibold text-xl">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="px-2 py-1 border rounded-md"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-start mt-4">
                  <Button onClick={handleAddToCart}>Add to Cart</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Display other items of shop  */}
        <div
          className="w-full p-5"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Carousel ref={emblaRef} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {items &&
                items.length > 0 &&
                items.map((item) => (
                  <CarouselItem
                    key={item?._id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2"
                  >
                    <Card className="cursor-pointer w-full h-full">
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
                      <CardFooter className="flex justify-between items-center">
                        <p>
                          <span className="font-bold">Price:</span> $
                          {item?.price}
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => handleAddCarouselItemToCart(item)}
                        >
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
    </>
  );
};
