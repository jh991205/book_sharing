import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById, getReviewsByBook, Book, Review } from "../../util";

const Details = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!bookId) return;

      try {
        const [bookData, reviewData] = await Promise.all([
          getBookById(bookId),
          getReviewsByBook(bookId),
        ]);
        setBook(bookData);
        setReviews(reviewData);
      } catch (err) {
        console.error("Error loading book details", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookId]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="container mt-4">
      <h1>{book.name}</h1>

      <h3 className="mt-4">Reviews</h3>
      <ul>
        {reviews.map((r) => (
          <li key={r._id}>
            <strong>{r.user.firstName}</strong>: {r.contentReview} (⭐{" "}
            {r.ratings})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Details;
