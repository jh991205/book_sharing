import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Rating,
  CircularProgress,
} from "@mui/material";
import { User, Review, Book } from "../../util";
import {
  getFollowedBooks,
  getBooksByIds,
  getReviewsByUser,
  getUsersByIds,
  updateUser,
  updateReview,
  deleteReview,
} from "./client";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { deleteTagsByReview } from "../Management/client";

export default function Profile() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [followedBooks, setFollowedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedRatings, setEditedRatings] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.accountReducer.currentUser);
  const canManage = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  useEffect(() => {
    async function loadProfile() {
      try {
        const userReviews = await getReviewsByUser(user._id);
        setReviews(userReviews);

        if (user.followingList?.length) {
          const users = await getUsersByIds(user.followingList);
          setFollowingUsers(users);
        }

        const collections = await getFollowedBooks(user._id);
        const bookIds = collections.map((c: any) => c.bookId);
        const books = await getBooksByIds(bookIds);
        setFollowedBooks(books);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const startEditReview = (rv: Review) => {
    setEditingReviewId(rv._id);
    setEditedContent(rv.contentReview);
    setEditedRatings(rv.ratings);
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditedContent("");
    setEditedRatings(1);
  };

  const saveEditedReview = async (id: string) => {
    try {
      const updates: Partial<Review> = {
        contentReview: editedContent,
        ratings: editedRatings,
      };
      await updateReview(id, updates);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? ({ ...r, ...updates } as Review) : r))
      );
      cancelEditReview();
    } catch {
      alert("Failed to update review.");
    }
  };

  const removeReview = async (id: string) => {
    try {
      await deleteReview(id);
      await deleteTagsByReview(id),
        setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete review.");
    }
  };

  const handleEditClick = () => {
    if (!user) return;
    setUpdatedEmail(user.email);
    setUpdatedPassword("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedEmail("");
    setUpdatedPassword("");
  };

  const handleSaveChanges = async () => {
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
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <Typography>You are not logged in.</Typography>
      </>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={2}>
      <Navigation />
      <Typography variant="h4" gutterBottom textAlign="center">
        Welcome, {user.username}
      </Typography>

      {canManage && (
        <Box mb={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/profile/management")}
          >
            Admin Panel
          </Button>
        </Box>
      )}

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Following
        </Typography>
        {followingUsers.length > 0 ? (
          <List>
            {followingUsers.map((f) => (
              <ListItem key={f._id} disablePadding>
                <ListItemButton onClick={() => navigate(`/profile/${f._id}`)}>
                  <ListItemText primary={f.username} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            You’re not following anyone yet.
          </Typography>
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Account Info
        </Typography>
        {!isEditing ? (
          <>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Password:</strong> ******
            </Typography>
            <Button variant="outlined" onClick={handleEditClick} sx={{ mt: 1 }}>
              Edit Info
            </Button>
          </>
        ) : (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ width: "100%", maxWidth: 400 }}
          >
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={updatedPassword}
              onChange={(e) => setUpdatedPassword(e.target.value)}
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                sx={{ mr: 1 }}
              >
                Save Changes
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Collected Books
        </Typography>
        {followedBooks.length > 0 ? (
          <List>
            {followedBooks.map((book) => (
              <ListItem key={book._id} disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate(`/search/${encodeURIComponent(book.bookTitle)}`)
                  }
                >
                  <ListItemText primary={book.bookTitle} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            You’re not following any books yet.
          </Typography>
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Your Reviews
        </Typography>
        {reviews.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {reviews.map((rv) => (
              <ListItem
                key={rv._id}
                alignItems="flex-start"
                sx={{ flexDirection: "column", alignItems: "stretch" }}
              >
                {editingReviewId === rv._id ? (
                  <Box width="100%">
                    <TextField
                      label="Review"
                      multiline
                      fullWidth
                      rows={3}
                      margin="normal"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography component="legend">Rating</Typography>
                      <Rating
                        name="edit-rating"
                        value={editedRatings}
                        onChange={(_, newValue) =>
                          setEditedRatings(newValue ?? editedRatings)
                        }
                      />
                    </Box>
                    <Box mt={2} display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={() => saveEditedReview(rv._id)}
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onClick={cancelEditReview}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box width="100%">
                    <Typography variant="subtitle1">
                      <strong>{rv.bookTitle}</strong>
                    </Typography>
                    <Typography variant="body1">{rv.contentReview}</Typography>
                    <Rating value={rv.ratings} readOnly />
                    <Box mt={1} display="flex" justifyContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => startEditReview(rv)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => removeReview(rv._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            You haven’t written any reviews yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
