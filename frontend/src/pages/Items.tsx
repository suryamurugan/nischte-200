import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { SkeletonGrid } from "@/components/SkeletonGrid";

interface Item {
  _id: string;
  itemName: string;
  itemDescription: string;
  picture: string;
  offerId?: string;
  price: number;
  shopId: string;
  item: string;
}

interface PaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ItemsResponse {
  items: Item[];
  pagination: PaginationMetadata;
}

export const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const navigate = useNavigate();
  const { dispatch } = useCart();

  const fetchItems = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await axios.get<ItemsResponse>(
        `${API}/api/v1/shop/menu?page=${currentPage}&limit=${itemsPerPage}`
      );

      if (currentPage === 1) {
        setItems(res.data.items);
        setFilteredItems(res.data.items);
      } else {
        const newItems = [...items, ...res.data.items];
        setItems(newItems);
        setFilteredItems(newItems);
      }

      setHasMore(res.data.pagination.hasNextPage);
    } catch (error) {
      console.log("Failed to fetch items", error);
      toast.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(query.toLowerCase()) ||
        item.itemDescription.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
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

  const handleItemClick = (itemId: string, shopId: string) => {
    try {
      navigate(`/shop/${shopId}/menu/${itemId}`);
    } catch (error) {
      console.log("Failed to get item details");
      toast.error("Failed to navigate to item details");
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  const renderItemCard = (item: Item) => (
    <>
      {loading ? (
        <SkeletonGrid count={1} />
      ) : (
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
      )}
    </>
  );

  return (
    <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="my-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-extrabold text-black text-2xl">All Items</h1>
            <div className="w-1/3">
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {filteredItems.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4">
                {filteredItems.map(renderItemCard)}
              </div>

              {hasMore && !searchQuery && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    className="w-full max-w-xs"
                  >
                    {loading ? "Loading..." : "Load More Items"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
