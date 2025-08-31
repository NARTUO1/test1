import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  dateAdded: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "TOGGLE_ITEM"; payload: WishlistItem };

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction,
): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        return state; // Item already in wishlist
      }

      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case "TOGGLE_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      let newItems;

      if (existingItem) {
        newItems = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        newItems = [...state.items, action.payload];
      }

      return {
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case "CLEAR_WISHLIST": {
      return initialState;
    }

    default:
      return state;
  }
}

interface WishlistContextType {
  state: WishlistState;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const addItem = (item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const toggleItem = (item: WishlistItem) => {
    dispatch({ type: "TOGGLE_ITEM", payload: item });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isInWishlist = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
