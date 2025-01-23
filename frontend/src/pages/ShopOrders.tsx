import { API } from "@/utils/api";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface OrderItem {
  _id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  basePrice: number;
  originalPrice: number;
  finalPrice: number;
  savings: number;
  shopId: string;
  totalItems: number;
  appliedOffer: null | {
    offerId: string;
    offerName: string;
    description: string;
  };
}

interface OrderDetails {
  _id: string;
  userId: string;
  cartTotal: number;
  totalItems: number;
  originalQuantity: number;
  totalSavings: number;
  items: OrderItem[];
  transactionId: string;
  createdAt?: string;
}

export const ShopOrders: FC = () => {
  const { shopId } = useParams();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API}/api/v1/order/shop/view/${shopId}`
      );
      const sortedOrders = data.sort(
        (a: OrderDetails, b: OrderDetails) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      setError("Failed to fetch shop orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchOwnerOrderDetails();
    }
  }, [shopId]);

  if (loading) {
    return (
      <>
        <div className="px-6 md:px-[200px]">
          <Navbar />
          <h1 className="text-2xl font-bold mb-6">Shop Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Shop Orders</h1>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Shop Orders</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
            <CardDescription>
              Your shop hasn't received any orders yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-6">Shop Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order._id.slice(-8)}
                    </CardTitle>
                    <CardDescription>
                      Transaction ID: {order.transactionId}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="items">
                    <AccordionTrigger>
                      Order Details ({order.totalItems} items)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        {order.items
                          .filter((item) => item.shopId === shopId)
                          .map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-start border-b pb-3"
                            >
                              <div>
                                <p className="font-medium">{item.itemName}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} × ₹{item.basePrice}
                                </p>
                                {item.savings > 0 && (
                                  <p className="text-sm text-green-600">
                                    Savings: ₹{item.savings}
                                  </p>
                                )}
                                {item.appliedOffer && (
                                  <Badge variant="default" className="mt-1">
                                    {item.appliedOffer.description}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ₹{item.finalPrice}
                                </p>
                                {item.originalPrice !== item.finalPrice && (
                                  <p className="text-sm text-gray-600 line-through">
                                    ₹{item.originalPrice}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        <div className="flex justify-between text-sm">
                          <span>Items Total</span>
                          <span>₹{order.cartTotal}</span>
                        </div>
                        {order.totalSavings > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Total Savings</span>
                            <span>-₹{order.totalSavings}</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopOrders;
