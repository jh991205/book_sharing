import { useEffect, useState } from "react";
import { getReviewsByUser, logoutUser, User, Review } from "../../util";
import { getProfile } from "./client";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useDispatch } from "react-redux";
import { updateUser } from "./client";
import { setCurrentUser } from "./reducer";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProfile() {
      try {
        const currentUser = await getProfile();
        setUser(currentUser);
        setReviews(await getReviewsByUser(currentUser._id));
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
      dispatch(setCurrentUser(null));
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  }

  function handleEditClick() {
    if (!user) return;
    setUpdatedEmail(user.email);
    setUpdatedPassword("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setUpdatedEmail("");
    setUpdatedPassword("");
  }

  async function handleUpdateInfo() {
    if (!user) return;
    const updates: Partial<User> = {};
    if (updatedEmail !== user.email) updates.email = updatedEmail;
    if (updatedPassword) updates.password = updatedPassword;
    if (Object.keys(updates).length === 0) {
      alert("No changes to update.");
      return;
    }
    try {
      await updateUser(user._id, updates);
      alert("Account updated successfully.");
      setUser((u) => u && { ...u, ...updates });
      setIsEditing(false);
      setUpdatedEmail("");
      setUpdatedPassword("");
    } catch {
      alert("Failed to update account.");
    }
  }

  if (loading) {
    return (
      <div>
        <Navigation />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navigation />
        <p>You are not logged in.</p>
      </div>
    );
  }

  const canManage = user.role === "ADMIN" || user.role === "SUPERADMIN";

  return (
    <div className="container mt-4">
      <Navigation />

      <h1>Welcome, {user.username}</h1>
      <p>{user.followingList}</p>
      <div className="d-flex gap-2">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
        {canManage && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/profile/management")}
          >
            Admin Panel
          </button>
        )}
      </div>

      <section className="mt-4">
        <h4>Account Info</h4>
        {!isEditing ? (
          <>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Password:</strong> ******
            </p>
            <button className="btn btn-secondary" onClick={handleEditClick}>
              Edit Info
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="update-email" className="form-label">
                Email
              </label>
              <input
                id="update-email"
                type="email"
                className="form-control"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="update-password" className="form-label">
                New Password
              </label>
              <input
                id="update-password"
                type="password"
                className="form-control"
                value={updatedPassword}
                onChange={(e) => setUpdatedPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary me-2" onClick={handleUpdateInfo}>
              Save Changes
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </>
        )}
      </section>

      <section className="mt-4">
        <h3>Your Reviews</h3>
        <ul>
          {reviews.map((rv) => (
            <li key={rv._id}>
              <strong>{rv.bookTitle}</strong>: {rv.contentReview} ({rv.ratings})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
