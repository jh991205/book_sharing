import { useEffect, useState } from "react";
import { User, Review } from "../../util";
import { getReviewsByUser, getUsersByIds, updateUser } from "./client";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Profile() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.accountReducer.currentUser);

  useEffect(() => {
    async function loadProfile() {
      try {
        setReviews(await getReviewsByUser(user._id));
        if (user.followingList?.length) {
          const users = await getUsersByIds(user.followingList);
          setFollowingUsers(users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

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

  async function handleSaveChanges() {
    if (!user) return;
    const updates: Partial<User> = {};
    if (updatedEmail !== user.email) updates.email = updatedEmail;
    if (updatedPassword) updates.password = updatedPassword;
    try {
      await updateUser(user._id, updates);
      dispatch(setCurrentUser({ ...user, ...updates }));
      setIsEditing(false);
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
      <div className="d-flex gap-2 mb-3">
        {canManage && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/profile/management")}
          >
            Admin Panel
          </button>
        )}
      </div>
      <section className="mb-4">
        <h4>Following</h4>
        {followingUsers.length > 0 ? (
          <ul className="list-group">
            {followingUsers.map((f) => (
              <li
                key={f._id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/profile/${f._id}`)}
              >
                {f.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">You’re not following anyone yet.</p>
        )}
      </section>
      <section className="mb-4">
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
            <button
              className="btn btn-primary me-2"
              onClick={handleSaveChanges}
            >
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
      <section>
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
