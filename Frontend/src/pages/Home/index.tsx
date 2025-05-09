import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Post from "./Post";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Rating,
} from "@mui/material";
import { Book, Review, User } from "../../util";
import { getRandomBooks, getGenres, getBooksByGenre } from "./client";
import { likeReview, dislikeReview, getTagsForReview } from "../Details/client";
import { getReviewsByUser, getUsersByIds } from "../Profile/client";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

export default function Home() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [reviews, setReviews] = useState<
    (Review & { authorUsername: string })[]
  >([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const randBooks = await getRandomBooks();
        setBooks(randBooks);

        const followIds = currentUser?.followingList ?? [];
        if (followIds.length > 0) {
          const followedUsers: User[] = await getUsersByIds(followIds);
          const idToUsername = Object.fromEntries(
            followedUsers.map((u) => [u._id, u.username])
          );

          let allReviews: (Review & { authorUsername: string })[] = [];
          for (const userId of followIds) {
            const userReviews = await getReviewsByUser(userId);
            const annotated = userReviews.map((r) => ({
              ...r,
              authorUsername: idToUsername[userId] || "Unknown",
            }));
            allReviews = allReviews.concat(annotated);
          }

          const shuffled = allReviews.sort(() => 0.5 - Math.random());
          setReviews(shuffled.slice(0, 5));
        }
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const nested = await Promise.all(
          reviews.map((r) => getTagsForReview(r._id))
        );
        setTags(nested.flat());
      } catch (err) {
        console.error("Error fetching tags", err);
      }
    };
    if (reviews.length) fetchTags();
  }, [reviews]);

  const countTags = (reviewId: string, type: "like" | "dislike") =>
    tags.filter((t) => t.review === reviewId && t.type === type).length;

  const hasReacted = (reviewId: string, type: "like" | "dislike") =>
    tags.some(
      (t) =>
        t.review === reviewId && t.user === currentUser?._id && t.type === type
    );

  const handleReaction = async (reviewId: string, type: "like" | "dislike") => {
    if (!currentUser) {
      if (window.confirm("Login to react. Go to login page?"))
        navigate("/login");
      return;
    }
    try {
      if (type === "like") await likeReview(reviewId, currentUser._id);
      else await dislikeReview(reviewId, currentUser._id);
      const nested = await Promise.all(
        reviews.map((r) => getTagsForReview(r._id))
      );
      setTags(nested.flat());
    } catch (err) {
      console.error("Error sending reaction", err);
    }
  };
  // 1a. Load all genres once
  useEffect(() => {
    async function loadGenres() {
      const list = await getGenres();
      setGenres(list);
      if (list.length) setSelectedGenre(list[0]);
    }
    loadGenres();
  }, []);

  // 1b. Whenever selectedGenre changes, fetch & pick 5 random
  useEffect(() => {
    if (!selectedGenre) return;
    async function loadRandomBooks() {
      // Option A: fetch *all* books then sample client‑side
      const all = await getBooksByGenre(selectedGenre!);
      setBooks(all);

      // Option B: if your API supports it, ask backend for random 5:
      // const randomFive = await bookClient.getRandomBooksByGenre(selectedGenre, 5);
      // setBooks(randomFive);
    }
    loadRandomBooks();
  }, [selectedGenre]);

  return (
    <Box>
      <Navigation />
      <Box sx={{ width: "70vw", mx: "auto", p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Reviews Section */}
            {currentUser ? (
              <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Reviews from People You Follow
                </Typography>
                {reviews.length > 0 ? (
                  <List>
                    {reviews.map((rv) => (
                      <ListItem
                        key={rv._id}
                        sx={{
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1">
                          <strong>{rv.bookTitle}</strong> by {rv.authorUsername}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {rv.contentReview}
                        </Typography>
                        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                          <Rating
                            name={`rating-${rv._id}`}
                            value={rv.ratings}
                            readOnly
                            size="small"
                          />
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {rv.ratings}/5
                          </Typography>
                        </Box>

                        <Box display="flex">
                          <Box
                            component="span"
                            onClick={() => handleReaction(rv._id, "like")}
                            sx={{
                              cursor: "pointer",
                              mr: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <FaThumbsUp
                              style={{
                                color: hasReacted(rv._id, "like")
                                  ? "gold"
                                  : undefined,
                              }}
                            />
                            <Typography component="span" sx={{ ml: 0.5 }}>
                              {countTags(rv._id, "like")}
                            </Typography>
                          </Box>
                          <Box
                            component="span"
                            onClick={() => handleReaction(rv._id, "dislike")}
                            sx={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <FaThumbsDown
                              style={{
                                color: hasReacted(rv._id, "dislike")
                                  ? "gold"
                                  : undefined,
                              }}
                            />
                            <Typography component="span" sx={{ ml: 0.5 }}>
                              {countTags(rv._id, "dislike")}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    {currentUser
                      ? "No reviews to display. Follow users to see theirs."
                      : "Log in to see reviews."}
                  </Typography>
                )}
              </Paper>
            ) : null}

            {/* Books Section */}
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // stack on xs, row from md up
                width: "100%",
                maxHeight: 600,
              }}
            >
              {/* Sidebar */}
              <Box
                component="nav"
                sx={{
                  display: { xs: "none", md: "block" }, // hide below md
                  width: 240,
                  bgcolor: "background.paper",
                  borderRight: 1,
                  borderColor: "divider",
                  overflowY: "auto",
                }}
              >
                <List>
                  {genres.map((genre) => (
                    <ListItem key={genre} disablePadding>
                      <ListItemButton
                        selected={genre === selectedGenre}
                        onClick={() => setSelectedGenre(genre)}
                      >
                        <ListItemText primary={genre} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Main content always shows */}
              <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
                {books.map((book) => (
                  <Box key={book._id} sx={{ mb: 2 }}>
                    <Post
                      bookId={book._id}
                      title={book.bookTitle}
                      summary="Check out this book!"
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </>
        )}
      </Box>
      <Footer></Footer>
    </Box>
  );
}
