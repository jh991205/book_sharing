import React, { useEffect, useState } from "react";
import {
  getProfile,
  getReviewsByUser,
  logoutUser,
  getAllUsers,
  deleteUserById,
  getAllBooks,
  deleteBookById,
  getAllReviews,
  deleteReviewById,
  User,
  Review,
  Book,
} from "../../util";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { updateUser } from "./client";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // editing state + form fields
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await getProfile();
        setUser(currentUser);
        const userReviews = await getReviewsByUser(currentUser._id);
        setReviews(userReviews);

        if (currentUser.role === "ADMIN") {
          const [users, books, reviews] = await Promise.all([
            getAllUsers(),
            getAllBooks(),
            getAllReviews(),
          ]);
          setAllUsers(users);
          setAllBooks(books);
          setAllReviews(reviews);
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  // start edit mode & prefill email
  const handleEditClick = () => {
    if (user) {
      setUpdatedEmail(user.email);
      setUpdatedPassword("");
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedEmail("");
    setUpdatedPassword("");
  };

  const handleUpdateInfo = async () => {
    if (!user) return;

    try {
      const updates: Partial<User> = {};
      if (updatedEmail !== user.email) updates.email = updatedEmail;
      if (updatedPassword) updates.password = updatedPassword;

      if (Object.keys(updates).length === 0) {
        alert("No changes to update.");
        return;
      }

      await updateUser(user._id, updates);
      alert("Account updated successfully.");
      // merge updates into local user object
      setUser((u) => u && { ...u, ...updates });
      setIsEditing(false);
      setUpdatedEmail("");
      setUpdatedPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to update account.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUserById(id);
    setAllUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBookById(id);
    setAllBooks((prev) => prev.filter((b) => b._id !== id));
  };

  const handleDeleteReview = async (id: string) => {
    await deleteReviewById(id);
    setAllReviews((prev) => prev.filter((r) => r._id !== id));
  };

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

  return (
    <div className="container mt-4">
      <Navigation />
      <h1>Welcome, {user.username}</h1>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>

      <h4 className="mt-4">Account Info</h4>

      {!isEditing ? (
        <div>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Password:</strong> ******
          </p>
          <button className="btn btn-secondary" onClick={handleEditClick}>
            Edit Info
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <label htmlFor="update-email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="update-email"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="update-password" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="update-password"
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
        </div>
      )}

      <h3 className="mt-4">Your Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <strong>{review.bookTitle}</strong>: {review.contentReview} (
            {review.ratings})
          </li>
        ))}
      </ul>

      {user.role === "ADMIN" && (
        <div className="mt-5">
          <h2>Admin Panel</h2>

          {/* USERS */}
          <h4>All Users</h4>
          <ul>
            {allUsers.map((u) => (
              <li key={u._id}>
                {u.email} ({u.username})
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleDeleteUser(u._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {/* BOOKS */}
          <h4 className="mt-4">All Books</h4>
          <ul>
            {allBooks.map((b) => (
              <li key={b._id}>
                {b.name}
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleDeleteBook(b._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {/* REVIEWS */}
          <h4 className="mt-4">All Reviews</h4>
          <ul>
            {allReviews.map((r) => (
              <li key={r._id}>
                {r.user} on <strong>{r.bookTitle}</strong>: {r.contentReview}
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleDeleteReview(r._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
