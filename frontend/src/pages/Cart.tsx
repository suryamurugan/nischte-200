import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Navbar } from "@/components/Navbar";
import axios from "axios";
import { API } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { CartItem } from "@/types/Cart";
import { Footer } from "@/components/Footer";

interface OfferType {
  name: string;
}

interface OfferDescription {
  minOrder?: number;
  numberOfVisits?: number;
  description: string;
  discountRate?: number;
  plusOffers?: number;
  specialOccasionDate?: string;
}

interface Offer {
  offerType: OfferType;
  _isActive: boolean;
  offerDescription: OfferDescription;
  _id: string;
}

interface PriceDetails {
  originalPrice: number;
  finalPrice: number;
  appliedOffer?: Offer;
  savings: number;
}

export const Cart = () => {
  const { state, dispatch } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [applicableOffers, setApplicableOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [offerDetails, setOfferDetails] = useState<any[]>([]);

  const handleQuantityChange = (itemId: string, value: string) => {
    setQuantities({ ...quantities, [itemId]: value });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
      toast.success("Item removed from cart");
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { _id: itemId, quantity: newQuantity },
    });
  };

  const handleQuantityBlur = (itemId: string, currentQuantity: number) => {
    const inputValue = quantities[itemId];
    if (!inputValue) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: currentQuantity.toString(),
      }));
      return;
    }

    const newQuantity = parseInt(inputValue);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: currentQuantity.toString(),
      }));
      toast.error("Please enter a valid quantity");
      return;
    }

    handleUpdateQuantity(itemId, newQuantity);
  };

  const fetchOfferDetails = async () => {
    setIsLoadingOffers(true);
    try {
      const offerIds = Array.from(
        new Set(
          state.items
            .filter((item) => item.offerId && item.offerId.length > 0)
            .flatMap((item) => item.offerId)
        )
      );

      if (offerIds.length === 0) {
        setApplicableOffers([]);
        setOfferDetails([]);
        return;
      }

      console.log("totla offer", offerIds);

      const eligibleResponse = await axios.post(
        `${API}/api/v1/offer/eligible`,
        {
          offerIds: offerIds,
        }
      );

      if (eligibleResponse.data.success) {
        const eligibleOffers = eligibleResponse.data.applicableOffers;
        setApplicableOffers(eligibleOffers);

        // fetch offer details for eligible offers
        if (eligibleOffers.length > 0) {
          const eligibleOfferIds = eligibleOffers
            .map((offer: { offerId: any }) => offer.offerId)
            .join(",");
          const detailsResponse = await axios.get(
            `${API}/api/v1/offer/applicable`,
            {
              params: {
                offerId: eligibleOfferIds,
              },
            }
          );
          if (detailsResponse.data.offers) {
            setOfferDetails(detailsResponse.data.offers);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Error loading offers");
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const calculateItemPrice = (
    item: CartItem,
    offers: Offer[]
  ): PriceDetails => {
    if (!item.offerId || !offers || offers.length === 0) {
      return {
        originalPrice: item.price * item.quantity,
        finalPrice: item.price * item.quantity,
        savings: 0,
      };
    }

    const itemOffers = offers.filter(
      (offer) => item.offerId?.includes(offer._id) && offer._isActive
    );

    if (itemOffers.length === 0) {
      return {
        originalPrice: item.price * item.quantity,
        finalPrice: item.price * item.quantity,
        savings: 0,
      };
    }

    let bestPrice: PriceDetails = {
      originalPrice: item.price * item.quantity,
      finalPrice: item.price * item.quantity,
      savings: 0,
    };

    for (const offer of itemOffers) {
      const { offerDescription } = offer;
      let currentPrice = item.price * item.quantity;

      if (
        offerDescription.minOrder &&
        item.quantity < offerDescription.minOrder
      ) {
        continue;
      }

      if (offerDescription.discountRate) {
        currentPrice =
          item.price *
          item.quantity *
          (1 - offerDescription.discountRate / 100);
      }

      if (
        offerDescription.plusOffers &&
        offerDescription.numberOfVisits &&
        item.quantity >= offerDescription.numberOfVisits
      ) {
        const sets = Math.floor(
          item.quantity / offerDescription.numberOfVisits
        );
        const freeItems = sets * offerDescription.plusOffers;
        const paidItems = item.quantity - freeItems;
        currentPrice = paidItems * item.price;
      }

      if (offerDescription.specialOccasionDate) {
        const today = new Date();
        const occasionDate = new Date(offerDescription.specialOccasionDate);
        if (
          today.toDateString() === occasionDate.toDateString() &&
          offerDescription.discountRate
        ) {
          currentPrice =
            item.price *
            item.quantity *
            (1 - offerDescription.discountRate / 100);
        }
      }

      if (currentPrice < bestPrice.finalPrice) {
        bestPrice = {
          originalPrice: item.price * item.quantity,
          finalPrice: currentPrice,
          appliedOffer: offer,
          savings: item.price * item.quantity - currentPrice,
        };
      }
    }

    return bestPrice;
  };

  const calculateCartTotal = () => {
    return state.items.reduce((total, item) => {
      const priceDetails = calculateItemPrice(item, offerDetails);
      return total + priceDetails.finalPrice;
    }, 0);
  };

  const calculateTotalSavings = () => {
    return state.items.reduce((savings, item) => {
      const priceDetails = calculateItemPrice(item, offerDetails);
      return savings + priceDetails.savings;
    }, 0);
  };

  useEffect(() => {
    fetchOfferDetails();
  }, [state.items]);

  console.log("offer details", offerDetails);

  return (
    <div className="px-6 md:px-[200px] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {state.items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {state.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 border rounded"
                  >
                    <img
                      src={item.picture}
                      alt={item.itemName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.itemName}</h3>
                      <p className="text-lg">&#8377;{item.price}</p>
                    </div>
                    <div className="flex justify-between items-center sm:flex-row  sm:items-center gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <FaMinus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="text"
                          value={quantities[item._id] || item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id, e.target.value)
                          }
                          onBlur={() =>
                            handleQuantityBlur(item._id, item.quantity)
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <FaPlus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto  sm:mt-0"
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_FROM_CART",
                            payload: item._id,
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div>
              <h1 className="text-2xl font-bold mb-4">Your Offers</h1>
              {offerDetails &&
                offerDetails.length > 0 &&
                offerDetails.map((offer) => (
                  <Card
                    key={offer._id}
                    className={`flex flex-col mb-3 pl-3 bg-green-200`}
                  >
                    <div className="flex justify-between items-center pt-2">
                      <p className="font-semibold">
                        {offer.offerType.name} on {offer.itemName}
                      </p>
                    </div>
                    <div className="flex text-sm space-x-4">
                      <span>
                        Number of visits:{" "}
                        {offer.offerDescription.numberOfVisits}
                      </span>
                      {offer.offerDescription.plusOffers && (
                        <span>
                          Plus Offers: {offer.offerDescription.plusOffers}{" "}
                        </span>
                      )}

                      {offer.offerDescription.minOrder && (
                        <span>
                          Minimum Order: {offer.offerDescription.minOrder}{" "}
                        </span>
                      )}

                      {offer.offerDescription.specialOccasionDate && (
                        <span>
                          Special Occasion:{" "}
                          {new Date(
                            offer.offerDescription.specialOccasionDate
                          ).toLocaleDateString()}
                        </span>
                      )}

                      {typeof offer.offerDescription.discountRate ===
                        "number" && (
                        <span>
                          Discount Rate: {offer.offerDescription.discountRate}%{" "}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      Details: {offer.offerDescription.description}
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* TODO: Fix display items with their details */}
          <div className="lg:w-1/3">
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              {state.items.map((item) => {
                const priceDetails = calculateItemPrice(item, offerDetails);
                return (
                  <div key={item._id} className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {item.itemName} × {item.quantity}
                      </span>
                      <div>
                        {priceDetails.savings > 0 && (
                          <span className="line-through text-gray-500 mr-2">
                            ₹{priceDetails.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span>₹{priceDetails.finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    {priceDetails.appliedOffer && (
                      <div className="text-xs text-green-600 ml-4">
                        {priceDetails.appliedOffer.offerType.name} applied
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Total Items:</p>
                  <p>
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                {calculateTotalSavings() > 0 && (
                  <div className="flex justify-between items-center mb-2 text-green-600">
                    <p className="font-semibold">Total Savings:</p>
                    <p>₹{calculateTotalSavings().toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">Final Total:</p>
                  <p className="text-xl font-bold">
                    ₹{calculateCartTotal().toFixed(2)}
                  </p>
                </div>
              </div>

              <Button className="w-full mt-4">Proceed to Checkout</Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
