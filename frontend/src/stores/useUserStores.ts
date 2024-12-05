import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { IUser } from "../interfaces/user.interface";
import { LoginData, SignUpData } from "../interfaces/auth.data.interface";
import { LocalStorageHelper } from "../helpers/localStorage.helper";

interface UserStore {
  user: IUser | null;
  loading: boolean;
  checkingAuth: boolean;
  signUp: (registerData: SignUpData) => Promise<void>;
  login: (loginData: LoginData) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const local = new LocalStorageHelper();

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signUp: async (formData: SignUpData): Promise<void> => {
    const { username, firstName, lastName, email, password, confirmPassword } =
      formData;

    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await axiosInstance.post("/auth/sign-up", {
          username,
          firstName,
          lastName,
          email,
          password,
        });
        set({ user: res.data, loading: false });
        local.addItem("access_token", res.data.access_token);
        local.addItem("refresh_token", res.data.refresh_token);
        toast.success("Sign up successful!");
      } catch (err: unknown) {
        set({ loading: false });

        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.error || "An error occurred");
        }
      }
    }
  },

  login: async (loginData: LoginData): Promise<void> => {
    const { identifier, password } = loginData;
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        identifier,
        password,
      });
      set({ user: res.data, loading: false });
      local.addItem("access_token", res.data.access_token);
      local.addItem("refresh_token", res.data.refresh_token);
      toast.success("Sign up successful!");
    } catch (err: unknown) {
      set({ loading: false });
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },

  logout: async () => {
    try {
      const refresh_token = local.getItem("refresh_token");
      const res = await axiosInstance.post("/auth/logout", {
        refresh_token: refresh_token,
      });
      if (res) {
        set({ user: null });
        local.removeItem("refresh_token");
        local.removeItem("access_token");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.error || "An error occurred");
      }
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (err: unknown) {
      set({ checkingAuth: false });
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message || "You need to login", {
          icon: "ℹ️",
          id: "auth-error",
        });
      }
    }
  },
}));
