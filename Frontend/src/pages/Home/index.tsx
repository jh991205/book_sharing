import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Post from "./Post";
import { Book, Review } from "../../util";
import { getRandomBooks } from "./client";
import { useSelector } from "react-redux";
import { getReviewsByUser } from "../Profile/client";

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const user = useSelector((state: any) => state.accountReducer.currentUser);

  useEffect(() => {
    const load = async () => {
      try {
        const books = await getRandomBooks();
        setBooks(books);
        setReviews(await getReviewsByUser(user._id));
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Navigation />
      <div className="container mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {currentUser && (
              <div>
                <p className="mb-4">Welcome back, {currentUser.username}!</p>
                <section>
                  <h3>Your Reviews</h3>
                  <ul>
                    {reviews.map((rv: any) => (
                      <li key={rv._id}>
                        <strong>{rv.bookTitle}</strong>: {rv.contentReview} (
                        {rv.ratings})
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
            <h2>Popular Books</h2>
            {books.map((book) => (
              <Post
                key={book._id}
                bookId={book._id}
                title={book.bookTitle}
                summary="Check out this book!"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
