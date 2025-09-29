// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";

const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
