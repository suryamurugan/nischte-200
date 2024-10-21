import { CartAction, CartItem, CartState } from "@/types/Cart";

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: newItems,
        total: newTotal,
      };
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(
        (item) => item._id !== action.payload
      );
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: newItems,
        total: newTotal,
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item._id === action.payload._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: newItems,
        total: newTotal,
      };
    }

    case "LOAD_CART":
      const total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return {
        items: action.payload,
        total,
      };

    default:
      return state;
  }
};
