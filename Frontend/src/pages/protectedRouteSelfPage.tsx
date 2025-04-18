import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
export default function ProtectedRouteSelf({ children }: { children: any }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { profileId } = useParams<{ profileId: string }>();
  if (profileId === currentUser._id) {
    return <Navigate to="/profile" />;
  }
  return children;
}
