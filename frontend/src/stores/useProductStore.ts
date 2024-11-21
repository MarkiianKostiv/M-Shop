import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { LocalStorageHelper } from "../helpers/localStorage.helper";
import { IProduct } from "../interfaces/product.interface";

interface IProductStore {
  products: IProduct[];
  loading: boolean;
  setProducts: (products: IProduct[]) => void;
  createProduct: (productData: IProduct) => Promise<void>;
  getAllProducts: () => Promise<void>;
  getFeaturedProducts: () => Promise<void>;
  deleteProduct: (id: string | undefined) => Promise<void>;
  toggleFeaturedProduct: (id: string | undefined) => Promise<void>;
  getProductsByCategory: (category: string | undefined) => Promise<void>;
}

const local = new LocalStorageHelper();
const access_token = local.getItem("access_token");

export const useProductStore = create<IProductStore>((set, get) => ({
  products: [],
  loading: false,
  setProducts: (products: IProduct[]) => set({ products }),

  createProduct: async (productData: IProduct) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/product/add", productData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("New Product was added");
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },
  deleteProduct: async (id: string | undefined) => {
    try {
      set({ loading: true });
      await axiosInstance.delete(`/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product was deleted");
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "Failed to Fetch Products");
      }
    }
  },
  toggleFeaturedProduct: async (id: string | undefined) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.patch(
        `/product/update/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.updatedProduct.isFeatured }
            : product
        ),

        loading: false,
      }));
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "Failed to Fetch Products");
      }
    }
  },
  getAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/product", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      set({ products: res.data.products, loading: false });
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "Failed to Fetch Products");
      }
    }
  },

  getProductsByCategory: async (category: string | undefined) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/product/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },
  getFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/product/featured");
      set({ products: res.data, loading: false });
    } catch (err: unknown) {
      set({ loading: false });

      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },
}));
