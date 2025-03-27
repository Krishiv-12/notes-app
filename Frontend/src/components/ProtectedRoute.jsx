import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // ✅ Agar token nahi hai toh login page pe redirect kar do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Agar token hai toh requested page dikhane do
  return <Outlet />;
};

export default ProtectedRoute;
