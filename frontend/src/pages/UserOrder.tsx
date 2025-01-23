import { Navbar } from "@/components/Navbar";
import { API } from "@/utils/api";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
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
import { Footer } from "@/components/Footer";

interface OrderDetails {
  _id: string;
  transactionId: string;
  cartTotal: number;
  totalItems: number;
  totalSavings: number;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    basePrice: number;
    finalPrice: number;
    appliedOffer?: {
      offerId: string;
      offerName: string;
      description: string;
      discountRate?: number;
      plusOffer?: number;
    };
  }>;
  createdAt: string;
}

export const UserOrder = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API}/api/v1/order/user/view/${userId}`
      );
      const sortedOrders = data.sort(
        (a: OrderDetails, b: OrderDetails) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.log("res", error);

      setError("Failed to fetch your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserOrder();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
            <CardDescription>
              You haven't placed any orders yet.
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
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
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
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    ₹{order.cartTotal.toFixed(2)}
                  </Badge>
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
                        {order.items.map((item) => (
                          <div
                            key={item.itemId}
                            className="flex justify-between items-start border-b pb-3"
                          >
                            <div>
                              <p className="font-medium">{item.itemName}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹{item.basePrice}
                              </p>
                              {item.appliedOffer && (
                                <Badge variant="default" className="mt-1">
                                  {item.appliedOffer.description}
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium">₹{item.finalPrice}</p>
                          </div>
                        ))}
                        <div className="pt-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹{order.cartTotal}</span>
                          </div>
                          {order.totalSavings > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Total Savings</span>
                              <span>-₹{order.totalSavings}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold mt-2">
                            <span>Total</span>
                            <span>₹{order.cartTotal}</span>
                          </div>
                        </div>
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
