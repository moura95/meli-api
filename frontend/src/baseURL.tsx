import axios from "axios";

export const axiosBackend = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
