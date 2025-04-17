import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Post from "../../components/Post";
import { getRandomBooks, User, Book } from "../../util";
import { getProfile } from "../Profile/client";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [user, books] = await Promise.all([
          getProfile().catch(() => null),
          getRandomBooks(),
        ]);
        setCurrentUser(user);
        setBooks(books);
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
        ) : currentUser ? (
          <p>Welcome back, {currentUser.username}!</p>
        ) : (
          <>
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
