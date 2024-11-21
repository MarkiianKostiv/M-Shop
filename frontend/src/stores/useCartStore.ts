import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { LocalStorageHelper } from "../helpers/localStorage.helper";
import { IProduct } from "../interfaces/product.interface";

interface ICardStore {
  cart: IProduct[];
  coupon: any | null;
  loading: boolean;
  total: number;
  subtotal: number;
  calculateTotals: () => void;
  addToCart: (product: IProduct) => Promise<void>;
  getCartItems: () => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
}

const local = new LocalStorageHelper();
const access_token = local.getItem("access_token");

export const useCartStore = create<ICardStore>((set, get) => ({
  cart: [],
  coupon: null,
  loading: false,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/cart", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      set({ cart: res.data ?? [], loading: false });
    } catch (err: unknown) {
      set({ loading: false });
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },
  addToCart: async (product: IProduct) => {
    set({ loading: true });
    try {
      await axiosInstance.post(
        "/cart",
        { productId: product?._id },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      toast.success("Product was added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: (item.quantity ?? 0) + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (err: unknown) {
      set({ loading: false });
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },

  removeFromCart: async (productId: string) => {
    await axiosInstance.delete(`/cart/delete`, {
      data: { productId },
      headers: { Authorization: `Bearer ${access_token}` },
    });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },

  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axiosInstance.put(
      `/cart/add/${productId}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity ?? 0),
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
