import { CartAction, CartState } from "@/types/Cart";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from "react";

import { cartReducer } from "@/reducer/CartReducer";

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: Dispatch<CartAction>;
    }
  | undefined
>(undefined);

const initialState: CartState = {
  items: [],
  total: 0,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
