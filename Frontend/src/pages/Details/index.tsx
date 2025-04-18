import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as client from "./client"; // Adjust the path if needed
import Navigation from "../../components/Navigation";
import { getUserById } from "../Profile/client";

export default function Details() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { bookId } = useParams();
  const [searchParams] = useSearchParams();
  const canonicalTitle = searchParams.get("query");
  const [bookDetail, setBookDetail] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewAuthors, setReviewAuthors] = useState<Record<string, any>>({});

  // Fetch book details from the Google Books API using bookId.
  useEffect(() => {
    async function fetchBookDetail() {
      if (bookId) {
        try {
          const data = await client.getBookDetails(bookId);
          setBookDetail(data);
        } catch (error) {
          console.error("Error fetching book details:", error);
        }
      }
    }
    fetchBookDetail();
  }, [bookId]);

  // Once we have book details, fetch reviews for the canonical book title.
  useEffect(() => {
    async function fetchReviews() {
      // Use the canonical title passed in the URL, or fallback to the book title.
      const queryForReviews = canonicalTitle || bookDetail?.volumeInfo?.title;
      if (queryForReviews) {
        try {
          const reviewsData = await client.getReviewsForBook(queryForReviews);
          setReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    }
    fetchReviews();
  }, [bookDetail, canonicalTitle]);

  useEffect(() => {
    const ids = Array.from(new Set(reviews.map((r) => r.user)));
    Promise.all(
      ids.map((id) => getUserById(id).then((u: any) => [id, u]))
    ).then((entries) => setReviewAuthors(Object.fromEntries(entries)));
  }, [reviews]);

  const [tags, setTags] = useState<any[]>([]);

  async function fetchTags() {
    if (reviews.length > 0) {
      try {
        const allTags = await Promise.all(
          reviews.map((r) => client.getTagsForReview(r._id))
        );
        const flattened = allTags.flat();
        setTags(flattened);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
  }

  // Fetch all tags related to the reviews on this book
  useEffect(() => {
    fetchTags();
  }, [reviews]);

  // Helper: count tags for a review
  const countTags = (reviewId: string, type: "like" | "dislike") =>
    tags.filter((tag) => tag.review === reviewId && tag.type === type).length;

  // Helper: display stars
  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) =>
      i < count ? (
        <FaStar key={i} color="gold" />
      ) : (
        <FaRegStar key={i} color="gray" />
      )
    );

  const [genres, setGenres] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      if (!canonicalTitle) return;
      try {
        const data = await client.getGenresForBook(canonicalTitle);
        setGenres(data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    }
    fetchGenres();
  }, [canonicalTitle]);

  const navigate = useNavigate();

  const handleReaction = async (reviewId: string, type: "like" | "dislike") => {
    if (!currentUser) {
      const goLogin = window.confirm(
        "You must be logged in to react. Would you like to go to the login page?"
      );
      if (goLogin) navigate("/login");
      return;
    }

    try {
      if (type === "like") {
        await client.likeReview(reviewId, currentUser._id);
      } else {
        await client.dislikeReview(reviewId, currentUser._id);
      }
      // now refresh all tags for every review
      await fetchTags();
    } catch (err) {
      console.error("Error sending reaction:", err);
    }
  };

  const hasReacted = (reviewId: string, type: "like" | "dislike") =>
    tags.some(
      (t) =>
        t.review === reviewId && t.user === currentUser?._id && t.type === type
    );

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newContent, setNewContent] = useState("");

  const handleInitAdd = () => {
    if (!currentUser) {
      if (
        window.confirm(
          "You must be logged in to add a review. Go to login now?"
        )
      ) {
        navigate("/login");
      }
    } else {
      setShowAddForm(true);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // you’ll need a client.createReview(bookTitle, userId, rating, content)
      await client.createReview(
        canonicalTitle || bookDetail.volumeInfo.title,
        currentUser._id,
        newRating,
        newContent
      );
      // refresh list
      const reviewsData = await client.getReviewsForBook(
        canonicalTitle || bookDetail.volumeInfo.title
      );
      setReviews(reviewsData);
      setShowAddForm(false);
      setNewRating(0);
      setNewContent("");
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  return (
    <div className="container mt-4">
      <Navigation />
      {bookDetail ? (
        <div className="row">
          {/* Book Cover Section */}
          <div className="col-md-4">
            {bookDetail.volumeInfo?.imageLinks?.thumbnail ? (
              <img
                src={bookDetail.volumeInfo.imageLinks.thumbnail}
                alt={bookDetail.volumeInfo.title}
                className="img-fluid"
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>

          {/* Book Info Section */}
          <div className="col-md-8">
            <h2>{bookDetail.volumeInfo.title}</h2>
            {genres.length > 0 && (
              <div className="mb-3">
                <strong>Genres:</strong>{" "}
                {genres.map((g) => (
                  <span key={g._id} className="badge bg-secondary me-1">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            {bookDetail.volumeInfo.authors && (
              <h4>{bookDetail.volumeInfo.authors.join(", ")}</h4>
            )}
            <p>{bookDetail.volumeInfo.description}</p>
            <p>
              <strong>Publisher:</strong> {bookDetail.volumeInfo.publisher}
            </p>
            <p>
              <strong>Published Date:</strong>{" "}
              {bookDetail.volumeInfo.publishedDate}
            </p>
            <a
              href={bookDetail.volumeInfo.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              More on Google Books
            </a>
          </div>
        </div>
      ) : (
        <p>Loading book details...</p>
      )}

      <hr />

      {/* Reviews Section */}
      <div className="reviews mt-4">
        <h3>User Reviews</h3>
        <button className="btn btn-success mb-3" onClick={handleInitAdd}>
          + Add Review
        </button>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="card mb-3">
              <div className="card-body">
                <div className="mb-2">
                  {renderStars(review.ratings)}
                  <span className="ms-3 text-muted">
                    by{" "}
                    <Link to={`/profile/${review.user}`}>
                      {reviewAuthors[review.user]?.username || review.user}
                    </Link>
                  </span>
                </div>
                <p>{review.contentReview}</p>
                <div>
                  <span
                    className="me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleReaction(review._id, "like")}
                  >
                    <FaThumbsUp
                      className="me-1"
                      style={{
                        color: hasReacted(review._id, "like")
                          ? "gold"
                          : undefined,
                      }}
                    />
                    {countTags(review._id, "like")}
                  </span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleReaction(review._id, "dislike")}
                  >
                    <FaThumbsDown
                      className="me-1"
                      style={{
                        color: hasReacted(review._id, "dislike")
                          ? "gold"
                          : undefined,
                      }}
                    />
                    {countTags(review._id, "dislike")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet for this book. Be the first to review!</p>
        )}
        {showAddForm && (
          <form onSubmit={handleSubmitReview} className="card p-3 mb-4">
            <div className="mb-2">
              <strong>Rating:</strong>{" "}
              {[1, 2, 3, 4, 5].map((n) => (
                <FaStar
                  key={n}
                  style={{
                    cursor: "pointer",
                    color: n <= newRating ? "gold" : "gray",
                  }}
                  onClick={() => setNewRating(n)}
                  className="me-1"
                />
              ))}
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Write your review…"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
