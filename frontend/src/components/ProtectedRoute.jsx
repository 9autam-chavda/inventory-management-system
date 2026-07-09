import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute() {
  return authService.isAuthenticated()
    ? <Outlet />
    : <Navigate to="/" replace />;
}

export default ProtectedRoute;