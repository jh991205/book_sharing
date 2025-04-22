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

      <div className="row">
        {currentUser && bookId && (
          <div className="mb-3 text-end">
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
      </div>

      <div className="row">
        {/* Sidebar: hidden on xs/sm */}
        {books.length === 0 ? (
          <aside>
            <BookFilter onSearch={searchBooks} noBook={true} />
          </aside>
        ) : (
          <aside className="d-none d-lg-block col-lg-3">
            <BookFilter onSearch={searchBooks} noBook={false} />
          </aside>
        )}
        {/* Main content */}
        <main className="col-12 col-lg-9">
          {/* responsive 1‑2‑3‑4 column grid */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {books
              .filter((b) => b.volumeInfo?.imageLinks?.thumbnail)
              .map((book) => (
                <div
                  key={book.id}
                  className="col"
                  style={{ maxWidth: "300px" }}
                >
                  <div className="card h-100">
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <div className="card-body d-flex flex-column pb-0">
                      <h5 className="card-title text-truncate">
                        {book.volumeInfo.title}
                      </h5>
                      <p
                        className="card-text flex-fill"
                        style={{
                          WebkitLineClamp: 3,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {book.volumeInfo.description ||
                          "No description available."}
                      </p>
                      <div className="mt-auto d-flex justify-content-end flex-nowrap gap-2">
                        <a
                          href={book.volumeInfo.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm flex-shrink-0"
                        >
                          Link
                        </a>
                        <Link
                          to={`/details/${book.id}?query=${encodeURIComponent(
                            keyword || ""
                          )}`}
                          className="btn btn-secondary btn-sm flex-shrink-0"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
