import axios from "axios";
import { LocalStorageHelper } from "../helpers/localStorage.helper";

const local = new LocalStorageHelper();
const access_token = local.getItem("access_token");

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: { Authorization: `Bearer ${access_token}` },
});
