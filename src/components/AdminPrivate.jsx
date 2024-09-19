import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivate = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser?.isAdmin || currentUser?.rest?.isAdmin && currentUser ? <Outlet /> : <Navigate to="/sign-in" />


}

export default AdminPrivate