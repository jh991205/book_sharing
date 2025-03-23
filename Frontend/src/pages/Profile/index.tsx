import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/">
            {/* <img
              src="/logo.png" // Replace with your logo path
              alt="Book Haven Logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            /> */}
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
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">My Profile (Editable)</h2>

        {/* Profile Information Card */}
        <div className="card mb-4">
          <h3>Username</h3>
          <p>Bio: "A short bio about yourself."</p>
          <button className="btn btn-primary">Edit Profile</button>
        </div>

        {/* Activity Section */}
        <div className="card">
          <div className="card-header">My Activity</div>
          <div className="card-body">
            <h5 className="card-title">My Reviews:</h5>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">[Review snippet 1]</li>
              <li className="list-group-item">[Review snippet 2]</li>
            </ul>
            <h5 className="card-title">Favorites:</h5>
            <p className="card-text">[Book covers or titles]</p>
            <h5 className="card-title">Following:</h5>
            <p className="card-text">[List of users]</p>
            <h5 className="card-title">Followers:</h5>
            <p className="card-text">[List of users]</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light border-top mt-4 py-3">
        <div className="container text-center">
          <Link className="text-decoration-none me-3" to="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-decoration-none" to="/contact">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
