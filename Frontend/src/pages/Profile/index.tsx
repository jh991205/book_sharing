import { Link } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function Profile() {
  return (
    <div>
      <Navigation />
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
      <Footer />
    </div>
  );
}
