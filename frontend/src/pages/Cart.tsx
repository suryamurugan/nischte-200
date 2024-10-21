import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export const Cart = () => {
  const { state, dispatch } = useCart();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {state.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {state.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 mb-4 p-4 border rounded"
            >
              <img
                src={item.picture}
                alt={item.itemName}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold">{item.itemName}</h3>
                <p>${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  dispatch({ type: "REMOVE_FROM_CART", payload: item._id })
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="mt-4">
            <p className="text-xl font-bold">
              Total: ${state.total.toFixed(2)}
            </p>
            <Button
              className="mt-4"
              onClick={() => dispatch({ type: "CLEAR_CART" })}
            >
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
