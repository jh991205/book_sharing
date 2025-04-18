import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, Review } from "../../util";
import { getUserById, getReviewsByUser } from "../Profile/client";
import { followUser, unfollowUser } from "./client";
import Navigation from "../../components/Navigation";
import { setCurrentUser } from "../Profile/reducer";

export default function PublicProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="container mt-4">
      <Navigation />
      <h1>{user.username}'s Public Profile</h1>
      <button
        className={`btn ${
          isFollowing ? "btn-outline-danger" : "btn-primary"
        } mb-3`}
        onClick={handleToggleFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
      <p>Username: {user.username}</p>
      <h3 className="mt-4">Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <strong>{review.bookTitle}</strong>: {review.contentReview} (⭐{" "}
            {review.ratings})
          </li>
        ))}
      </ul>
    </div>
  );
}
