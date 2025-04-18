import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Rating,
  Button,
} from "@mui/material";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Navigation from "../../components/Navigation";
import { User, Review } from "../../util";
import { getUserById, getReviewsByUser } from "../Profile/client";
import { followUser, unfollowUser } from "./client";
import { likeReview, dislikeReview, getTagsForReview } from "../Details/client";
import { setCurrentUser } from "../Profile/reducer";

export default function PublicProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isFollowing = currentUser?.followingList.includes(profileId!);

  useEffect(() => {
    async function load() {
      if (!profileId) return;
      const [userData, userReviews] = await Promise.all([
        getUserById(profileId),
        getReviewsByUser(profileId),
      ]);
      setUser(userData);
      setReviews(userReviews);
      setLoading(false);
    }
    load();
  }, [profileId]);

  useEffect(() => {
    if (!reviews.length) return;
    (async () => {
      const nested = await Promise.all(
        reviews.map((r) => getTagsForReview(r._id))
      );
      setTags(nested.flat());
    })();
  }, [reviews]);

  const countTags = (reviewId: string, type: "like" | "dislike") =>
    tags.filter((t) => t.review === reviewId && t.type === type).length;

  const hasReacted = (reviewId: string, type: "like" | "dislike") =>
    tags.some(
      (t) =>
        t.review === reviewId && t.user === currentUser?._id && t.type === type
    );

  async function handleToggleFollow() {
    if (!currentUser || !profileId) return;
    if (isFollowing) {
      await unfollowUser(currentUser._id, profileId);
      dispatch(
        setCurrentUser({
          ...currentUser,
          followingList: currentUser.followingList.filter(
            (_id: any) => _id !== profileId
          ),
        })
      );
    } else {
      await followUser(currentUser._id, profileId);
      dispatch(
        setCurrentUser({
          ...currentUser,
          followingList: [...currentUser.followingList, profileId],
        })
      );
    }
  }

  const handleReaction = async (reviewId: string, type: "like" | "dislike") => {
    if (!currentUser) return;
    if (type === "like") await likeReview(reviewId, currentUser._id);
    else await dislikeReview(reviewId, currentUser._id);
    const nested = await Promise.all(
      reviews.map((r) => getTagsForReview(r._id))
    );
    setTags(nested.flat());
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Box>
      <Navigation />
      <Box sx={{ width: "70vw", mx: "auto", p: 2 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {user.username}’s Profile
          </Typography>
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            color={isFollowing ? "error" : "primary"}
            onClick={handleToggleFollow}
            sx={{ mb: 2 }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>

          <Typography variant="h6" gutterBottom>
            Reviews
          </Typography>
          {reviews.length > 0 ? (
            <List>
              {reviews.map((rv) => (
                <ListItem
                  key={rv._id}
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{rv.bookTitle}</strong>
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

                  <Box display="flex" alignItems="center">
                    <Box
                      component="span"
                      onClick={() => handleReaction(rv._id, "like")}
                      sx={{ cursor: "pointer", display: "flex", mr: 2 }}
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
                      sx={{ cursor: "pointer", display: "flex" }}
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
            <Typography color="textSecondary">No reviews yet.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
