import { useState, useEffect } from "react";
import * as bookClient from "./client";
import {
  getFollowedCollectionsByUser,
  followBook,
  unfollowBook,
  getBookByTitle,
} from "./client";
import { Link, useParams, useNavigate } from "react-router-dom";
import BookFilter from "./BookFilter";
import Navigation from "../../components/Navigation";
import { useSelector } from "react-redux";

export default function BookSearch() {
  const [query, setQuery] = useState("To Kill a Mockingbird");
  const [books, setBooks] = useState<any[]>([]);
  const [followedCollections, setFollowedCollections] = useState<any[]>([]);
  const [bookId, setBookId] = useState<string | null>(null);

  const { keyword } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );

  useEffect(() => {
    const fetchBookId = async () => {
      if (!keyword) return;
      try {
        const foundBook = await getBookByTitle(keyword);
        setBookId(foundBook._id);
      } catch (err) {
        console.error("Could not find book by title", err);
        setBookId(null);
      }
    };
    fetchBookId();
  }, [keyword]);

  useEffect(() => {
    const loadFollows = async () => {
      if (currentUser?._id) {
        const collections = await getFollowedCollectionsByUser(currentUser._id);
        setFollowedCollections(collections);
      }
    };
    loadFollows();
  }, [currentUser]);

  useEffect(() => {
    if (keyword) {
      setQuery(keyword);
      searchBooks(keyword);
    }
  }, [keyword]);

  const searchBooks = async (keyword?: string) => {
    const finalQuery = keyword || query;
    const resultBooks = await bookClient.searchBooks(finalQuery);
    setBooks(resultBooks);
    navigate(`/search/${finalQuery}`);
  };

  const isFollowed = (bookId: string) => {
    return followedCollections.some((col) => col.bookId === bookId);
  };

  const getCollectionId = (bookId: string) => {
    return followedCollections.find((col) => col.bookId === bookId)?._id;
  };

  const handleToggleFollow = async () => {
    if (!currentUser || !bookId) return;

    try {
      if (isFollowed(bookId)) {
        const collectionId = getCollectionId(bookId);
        if (collectionId) {
          await unfollowBook(collectionId);
          setFollowedCollections(
            followedCollections.filter((col) => col._id !== collectionId)
          );
        }
      } else {
        const newCol = await followBook(currentUser._id, bookId);
        setFollowedCollections([...followedCollections, newCol]);
      }
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container mt-4">
      <Navigation />
      <div className="d-flex">
        <div className="d-none d-md-block" style={{ width: "300px" }}>
          <BookFilter onSearch={searchBooks} />
        </div>

        <div className="flex-fill" style={{ padding: "1rem" }}>
          {currentUser && bookId && (
            <div className="mb-3">
              <button
                className={`btn ${
                  isFollowed(bookId) ? "btn-danger" : "btn-success"
                }`}
                onClick={handleToggleFollow}
              >
                {isFollowed(bookId)
                  ? "Remove from Collection"
                  : "Add to Collection"}
              </button>
            </div>
          )}

          <div
            style={{ overflowY: "auto", maxHeight: "100vh" }}
            className="row mt-4"
          >
            {books
              .filter((book) => book.volumeInfo?.imageLinks?.thumbnail)
              .map((book) => (
                <div key={book.id} className="col-4 mb-4">
                  <div className="card mb-2">
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="card-img-top"
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{book.volumeInfo.title}</h5>
                      <p className="card-text">
                        {book.volumeInfo.description
                          ? book.volumeInfo.description.substring(0, 100) +
                            "..."
                          : "No description available."}
                      </p>
                      <div className="mt-auto d-flex flex-wrap gap-2">
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
