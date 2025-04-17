import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Post from "../../components/Post";
import { getRandomBooks, Book } from "../../util";
import { useSelector } from "react-redux";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    const load = async () => {
      try {
        const books = await getRandomBooks();
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
        ) : (
          <>
            {currentUser && (
              <div>
                <p className="mb-4">Welcome back, {currentUser.username}!</p>
                <p>{currentUser.followingList}</p>
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
