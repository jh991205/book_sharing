import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, getReviewsByUser, User, Review } from "../../util";
import Navigation from "../../components/Navigation";

const PublicProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) return;
      try {
        const [userData, userReviews] = await Promise.all([
          getUserById(profileId),
          getReviewsByUser(profileId),
        ]);
        setUser(userData);
        setReviews(userReviews);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [profileId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="container mt-4">
      <Navigation />
      <h1>{user.username}'s Public Profile</h1>
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
};

export default PublicProfile;
