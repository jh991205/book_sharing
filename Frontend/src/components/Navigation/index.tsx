import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../pages/Profile/reducer";
import { logoutUser } from "../../pages/Login/client";

export default function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setCurrentUser(null));
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Book Haven
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/search">
                Search
              </Link>
            </li>

            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
            )}

            {currentUser ? (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  style={{ textDecoration: "none" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
