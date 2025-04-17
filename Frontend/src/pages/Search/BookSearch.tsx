import { useState, useEffect } from "react";
import * as bookClient from "./client";
import { Link, useParams, useNavigate } from "react-router-dom";
import BookFilter from "./BookFilter";

import Navigation from "../../components/Navigation";

export default function BookSearch() {
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
    <div className="container mt-4">
      <Navigation />
      <div className="d-flex">
        <div className="d-none d-md-block" style={{ width: "300px" }}>
          <BookFilter onSearch={searchBooks} />
        </div>

        {/* Main content area: scrollable */}
        <div
          className="flex-fill"
          style={{ overflowY: "auto", maxHeight: "100vh", padding: "1rem" }}
        >
          <div className="row mt-4">
            {books
              .filter((book) => book.volumeInfo?.imageLinks?.thumbnail)
              .map((book) => (
                <div key={book.id} className="col-4 mb-4">
                  <div className="card mb-2">
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
                          ? book.volumeInfo.description.substring(0, 100) +
                            "..."
                          : "No description available."}
                      </p>
                      <div className="mt-auto d-flex">
                        <a
                          href={book.volumeInfo.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary me-2"
                        >
                          More Info
                        </a>
                        <Link
                          to={`/details/${book.id}?query=${encodeURIComponent(
                            keyword || ""
                          )}`}
                          className="btn btn-secondary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
