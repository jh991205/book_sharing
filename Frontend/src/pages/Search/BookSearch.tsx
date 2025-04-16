import { useState, useEffect } from "react";
import * as bookClient from "./client";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";

export default function BookSearch() {
  const bestBooks = [
    "To Kill a Mockingbird",
    "1984",
    "Pride and Prejudice",
    "The Great Gatsby",
    "Moby-Dick",
    "War and Peace",
    "The Odyssey",
    "Crime and Punishment",
    "The Brothers Karamazov",
    "One Hundred Years of Solitude",
    "Ulysses",
    "The Lord of the Rings",
    "Anna Karenina",
    "The Catcher in the Rye",
    "The Grapes of Wrath",
    "Brave New World",
    "Wuthering Heights",
    "Jane Eyre",
    "The Divine Comedy",
    "Don Quixote",
    "Fahrenheit 451",
    "The Iliad",
    "Les Misérables",
    "A Tale of Two Cities",
    "Great Expectations",
    "The Sound and the Fury",
    "Lolita",
    "Invisible Man",
    "Beloved",
    "Middlemarch",
    "The Stranger",
    "Catch-22",
    "A Clockwork Orange",
    "The Trial",
    "Heart of Darkness",
  ];
  const [query, setQuery] = useState("To Kill a Mockingbird");
  const [books, setBooks] = useState<any[]>([]);
  // Assume our route is defined as /search/:search? where "search" is an optional param
  const { keyword } = useParams();
  const navigate = useNavigate();

  // Function that fetches book data based on a given query.
  const searchBooks = async (keyword?: string) => {
    const finalQuery = keyword || query;
    const resultBooks = await bookClient.searchBooks(finalQuery);
    setBooks(resultBooks);
    navigate(`/search/${finalQuery}`); // Update the URL with the search term
  };

  // When the component loads or the URL changes, check if a search term is present.
  useEffect(() => {
    if (keyword) {
      setQuery(keyword);
      searchBooks(keyword);
    }
  }, [keyword]);
  return (
    <div>
      <Navigation />
      <h2>Book Search</h2>
      {/* Dropdown for selecting one of the best books */}
      <select
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control mb-2"
      >
        {bestBooks.map((title, index) => (
          <option key={index} value={title}>
            {title}
          </option>
        ))}
      </select>
      <button
        className="btn btn-primary"
        onClick={async () => {
          searchBooks();
        }}
      >
        Search
      </button>

      {books && books.length > 0 && (
        <div className="row mt-4">
          {books
            .filter((book) => book.volumeInfo?.imageLinks?.thumbnail)
            .map((book) => (
              <div key={book.id} className="col-4">
                <div className="card h-100 mb-4">
                  {book.volumeInfo?.imageLinks?.thumbnail && (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="card-img-top"
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{book.volumeInfo.title}</h5>
                    <p className="card-text">
                      {book.volumeInfo.description
                        ? book.volumeInfo.description.substring(0, 100) + "..."
                        : "No description available."}
                    </p>

                    <div className="mt-auto">
                      <a
                        href={book.volumeInfo.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        More Info
                      </a>
                      <Link
                        to={`/details/${book.id}?query=${encodeURIComponent(
                          query
                        )}`}
                        className="btn btn-secondary ms-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
