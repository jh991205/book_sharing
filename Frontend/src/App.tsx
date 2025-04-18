import "./App.css";
import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Management from "./pages/Management";
import ProtectedRoute from "./pages/protectedRoute";
import ProtectedRouteManagement from "./pages/protectedRouteManagement";
import { Provider } from "react-redux";
import store from "./pages/store";
import Session from "./pages/Profile/session";
import ProtectedRouteSelf from "./pages/protectedRouteSelfPage";

export default function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <Session>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/:keyword" element={<Search />} />
            <Route path="/details/:bookId" element={<Details />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:profileId"
              element={
                <ProtectedRouteSelf>
                  <PublicProfile />
                </ProtectedRouteSelf>
              }
            />
            <Route
              path="/profile/management"
              element={
                <ProtectedRouteManagement>
                  <Management />
                </ProtectedRouteManagement>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Session>
      </Provider>
    </HashRouter>
  );
}
