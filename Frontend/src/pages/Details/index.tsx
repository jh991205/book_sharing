import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import * as client from "./client"; // Adjust the path if needed
import Navigation from "../../components/Navigation";

export default function Details() {
  const { bookId } = useParams();
  const [searchParams] = useSearchParams();
  const canonicalTitle = searchParams.get("query");
  const [bookDetail, setBookDetail] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

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

  const [tags, setTags] = useState<any[]>([]);

  // Fetch all tags related to the reviews on this book
  useEffect(() => {
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
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="card mb-3">
              <div className="card-body">
                <div className="mb-2">
                  {renderStars(review.ratings)}
                  <span className="ms-3 text-muted">
                    by <Link to={`/profile/${review.user}`}>{review.user}</Link>
                  </span>
                </div>
                <p>{review.contentReview}</p>
                <div>
                  <span className="me-3">
                    <FaThumbsUp className="me-1" />{" "}
                    {countTags(review._id, "like")}
                  </span>
                  <span>
                    <FaThumbsDown className="me-1" />{" "}
                    {countTags(review._id, "dislike")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet for this book. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
