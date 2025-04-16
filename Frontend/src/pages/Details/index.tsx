import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
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
                <p>{review.contentReview}</p>
                <p>
                  <strong>Rating:</strong> {review.ratings}{" "}
                  <span className="ms-2">
                    <strong>Reviewed by:</strong>{" "}
                    <Link to={`/profile/${review.user}`}>{review.user}</Link>
                  </span>
                </p>
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
