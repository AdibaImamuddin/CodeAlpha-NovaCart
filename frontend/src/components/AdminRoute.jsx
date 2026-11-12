
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  // Agar login nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar user admin nahi hai
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Agar user admin hai
  return children;
}

export default AdminRoute;
