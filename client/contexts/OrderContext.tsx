import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
  vendorId: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  vendorId: string;
  vendorName: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  paymentMethod?: string;
  createdAt: string;
  estimatedDelivery?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface OrderState {
  orders: Order[];
  pendingOrders: Order[];
}

type OrderAction =
  | { type: "CREATE_ORDER"; payload: Omit<Order, "id" | "createdAt"> }
  | {
      type: "UPDATE_ORDER_STATUS";
      payload: { orderId: string; status: Order["status"] };
    }
  | {
      type: "UPDATE_PAYMENT_STATUS";
      payload: {
        orderId: string;
        paymentStatus: Order["paymentStatus"];
        paymentId?: string;
      };
    }
  | {
      type: "ADD_PAYMENT_ID";
      payload: { orderId: string; paymentId: string; paymentMethod: string };
    }
  | { type: "CANCEL_ORDER"; payload: string }
  | { type: "LOAD_ORDERS_FROM_STORAGE" };

const initialState: OrderState = {
  orders: [],
  pendingOrders: [],
};

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "CREATE_ORDER": {
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newOrder: Order = {
        ...action.payload,
        id: orderId,
        createdAt: new Date().toISOString(),
      };

      // Calculate estimated delivery (3-7 business days)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(
        estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 3,
      );
      newOrder.estimatedDelivery = estimatedDelivery.toISOString();

      const updatedState = {
        ...state,
        orders: [...state.orders, newOrder],
        pendingOrders:
          newOrder.paymentStatus === "pending"
            ? [...state.pendingOrders, newOrder]
            : state.pendingOrders,
      };

      // Save to localStorage
      localStorage.setItem(
        "marketplace_orders",
        JSON.stringify(updatedState.orders),
      );
      return updatedState;
    }

    case "UPDATE_ORDER_STATUS": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? { ...order, status: action.payload.status }
          : order,
      );

      const updatedState = {
        ...state,
        orders: updatedOrders,
        pendingOrders: state.pendingOrders.map((order) =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order,
        ),
      };

      localStorage.setItem(
        "marketplace_orders",
        JSON.stringify(updatedState.orders),
      );
      return updatedState;
    }

    case "UPDATE_PAYMENT_STATUS": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? {
              ...order,
              paymentStatus: action.payload.paymentStatus,
              paymentId: action.payload.paymentId || order.paymentId,
              status:
                action.payload.paymentStatus === "paid"
                  ? "confirmed"
                  : order.status,
            }
          : order,
      );

      const updatedPendingOrders = state.pendingOrders
        .map((order) =>
          order.id === action.payload.orderId
            ? {
                ...order,
                paymentStatus: action.payload.paymentStatus,
                paymentId: action.payload.paymentId || order.paymentId,
                status:
                  action.payload.paymentStatus === "paid"
                    ? "confirmed"
                    : order.status,
              }
            : order,
        )
        .filter((order) => order.paymentStatus === "pending");

      const updatedState = {
        ...state,
        orders: updatedOrders,
        pendingOrders: updatedPendingOrders,
      };

      localStorage.setItem(
        "marketplace_orders",
        JSON.stringify(updatedState.orders),
      );
      return updatedState;
    }

    case "ADD_PAYMENT_ID": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? {
              ...order,
              paymentId: action.payload.paymentId,
              paymentMethod: action.payload.paymentMethod,
              paymentStatus: "paid",
              status: "confirmed",
            }
          : order,
      );

      const updatedState = {
        ...state,
        orders: updatedOrders,
        pendingOrders: state.pendingOrders.filter(
          (order) => order.id !== action.payload.orderId,
        ),
      };

      localStorage.setItem(
        "marketplace_orders",
        JSON.stringify(updatedState.orders),
      );
      return updatedState;
    }

    case "CANCEL_ORDER": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload
          ? { ...order, status: "cancelled" as const }
          : order,
      );

      const updatedState = {
        ...state,
        orders: updatedOrders,
        pendingOrders: state.pendingOrders.filter(
          (order) => order.id !== action.payload,
        ),
      };

      localStorage.setItem(
        "marketplace_orders",
        JSON.stringify(updatedState.orders),
      );
      return updatedState;
    }

    case "LOAD_ORDERS_FROM_STORAGE": {
      const savedOrders = localStorage.getItem("marketplace_orders");
      if (savedOrders) {
        const orders = JSON.parse(savedOrders) as Order[];
        return {
          ...state,
          orders,
          pendingOrders: orders.filter(
            (order) => order.paymentStatus === "pending",
          ),
        };
      }
      return state;
    }

    default:
      return state;
  }
}

interface OrderContextType {
  state: OrderState;
  createOrder: (orderData: Omit<Order, "id" | "createdAt">) => string;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updatePaymentStatus: (
    orderId: string,
    paymentStatus: Order["paymentStatus"],
    paymentId?: string,
  ) => void;
  addPaymentId: (
    orderId: string,
    paymentId: string,
    paymentMethod: string,
  ) => void;
  cancelOrder: (orderId: string) => void;
  getOrdersByVendor: (vendorId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  getTotalSpentByVendor: (vendorId: string) => number;
  loadOrdersFromStorage: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from localStorage on mount
  React.useEffect(() => {
    dispatch({ type: "LOAD_ORDERS_FROM_STORAGE" });
  }, []);

  const createOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: "CREATE_ORDER", payload: orderData });
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } });
  };

  const updatePaymentStatus = (
    orderId: string,
    paymentStatus: Order["paymentStatus"],
    paymentId?: string,
  ) => {
    dispatch({
      type: "UPDATE_PAYMENT_STATUS",
      payload: { orderId, paymentStatus, paymentId },
    });
  };

  const addPaymentId = (
    orderId: string,
    paymentId: string,
    paymentMethod: string,
  ) => {
    dispatch({
      type: "ADD_PAYMENT_ID",
      payload: { orderId, paymentId, paymentMethod },
    });
  };

  const cancelOrder = (orderId: string) => {
    dispatch({ type: "CANCEL_ORDER", payload: orderId });
  };

  const getOrdersByVendor = (vendorId: string) => {
    return state.orders.filter((order) => order.vendorId === vendorId);
  };

  const getOrderById = (orderId: string) => {
    return state.orders.find((order) => order.id === orderId);
  };

  const getTotalSpentByVendor = (vendorId: string) => {
    return state.orders
      .filter(
        (order) =>
          order.vendorId === vendorId && order.paymentStatus === "paid",
      )
      .reduce((total, order) => total + order.total, 0);
  };

  const loadOrdersFromStorage = () => {
    dispatch({ type: "LOAD_ORDERS_FROM_STORAGE" });
  };

  return (
    <OrderContext.Provider
      value={{
        state,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        addPaymentId,
        cancelOrder,
        getOrdersByVendor,
        getOrderById,
        getTotalSpentByVendor,
        loadOrdersFromStorage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}

// Utility functions for multi-vendor payment processing
export const splitCartByVendor = (cartItems: any[]) => {
  const vendorGroups: { [vendorId: string]: any[] } = {};

  cartItems.forEach((item) => {
    const vendorId = item.vendorId || item.vendor || "default-vendor";
    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = [];
    }
    vendorGroups[vendorId].push(item);
  });

  return vendorGroups;
};

export const calculateVendorTotal = (items: any[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.18; // 18% GST
  const shippingCost = subtotal > 2000 ? 0 : 199; // Free shipping above ₹2000
  return {
    subtotal,
    tax,
    shippingCost,
    total: subtotal + tax + shippingCost,
  };
};
