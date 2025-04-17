import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function ProtectedRouteManagement({
  children,
}: {
  children: any;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (currentUser.role === "ADMIN" || currentUser.role === "SUPERADMIN") {
    return children;
  } else {
    return <Navigate to="/profile" />;
  }
}
