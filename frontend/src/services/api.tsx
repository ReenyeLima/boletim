import axios from "axios";
import jwt from "./jwt";

import { useAuthStore } from "@/lib/store/authStore";

const token = useAuthStore.getState().token;

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.request.use(
  (config) => {
    const { token, logout } = useAuthStore.getState();

    if (token) {
      if (jwt.isTokenExpired(token)) {
        logout();
        return Promise.reject(new axios.Cancel("Token expirado"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
