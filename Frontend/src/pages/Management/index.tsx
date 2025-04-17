import { useEffect, useState } from "react";
import { User, Book, Review } from "../../util";
import {
  getAllUsers,
  getAllBooks,
  getAllReviews,
  deleteUserById,
  deleteBookById,
  deleteReviewById,
} from "./client";
import { updateUser } from "../Profile/client";
import Navigation from "../../components/Navigation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Switch, FormControlLabel, Box, Typography } from "@mui/material";

export default function Management() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [users, books, reviews] = await Promise.all([
          getAllUsers(),
          getAllBooks(),
          getAllReviews(),
        ]);
        setAllUsers(users);
        setAllBooks(books);
        setAllReviews(reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const canToggleRole = currentUser?.role === "SUPERADMIN";

  async function handleRoleToggle(user: User) {
    const newRole = user.role === "USER" ? "ADMIN" : "USER";
    try {
      await updateUser(user._id, { role: newRole });
      setAllUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role", err);
      alert("Could not change role. Try again.");
    }
  }

  if (loading) {
    return (
      <div>
        <Navigation />
        <p>Loading admin data…</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Navigation />
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Admin Panel</h2>

      <section className="mt-4">
        <h4>All Users</h4>
        <ul>
          {allUsers.map((u) => (
            <li key={u._id} className="d-flex align-items-center mb-2">
              <Box flexGrow={1}>
                <Typography>
                  {u.email} ({u.username}) — <em>{u.role}</em>
                </Typography>
              </Box>

              {canToggleRole && u._id !== currentUser._id && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={u.role === "ADMIN"}
                      onChange={() => handleRoleToggle(u)}
                      size="small"
                    />
                  }
                  label={u.role === "ADMIN" ? "Admin" : "User"}
                />
              )}

              <button
                className="btn btn-sm btn-danger ms-3"
                onClick={() => {
                  deleteUserById(u._id);
                  setAllUsers((prev) => prev.filter((x) => x._id !== u._id));
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h4>All Books</h4>
        <ul>
          {allBooks.map((b) => (
            <li key={b._id}>
              {b.bookTitle}
              <button
                className="btn btn-sm btn-danger ms-2"
                onClick={() => {
                  deleteBookById(b._id);
                  setAllBooks((prev) => prev.filter((x) => x._id !== b._id));
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 mb-5">
        <h4>All Reviews</h4>
        <ul>
          {allReviews.map((r) => (
            <li key={r._id}>
              {r.user} on <strong>{r.bookTitle}</strong>: {r.contentReview}
              <button
                className="btn btn-sm btn-danger ms-2"
                onClick={() => {
                  deleteReviewById(r._id);
                  setAllReviews((prev) => prev.filter((x) => x._id !== r._id));
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
