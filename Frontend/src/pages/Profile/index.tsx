import { useEffect, useState } from "react";
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

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
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
        console.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;

  return (
    <div className="container mt-4">
      <h1>Welcome, {user.firstName}</h1>
      <p>Username: {user.username}</p>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>

      <h3 className="mt-4">Your Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <strong>{review.bookDetail.name}</strong>: {review.contentReview}{" "}
            (⭐ {review.ratings})
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
                {u.firstName} ({u.username})
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
                {r.user.firstName} on <strong>{r.bookDetail.name}</strong>:{" "}
                {r.contentReview}
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
