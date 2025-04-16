import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

// Use an environment variable or fallback to the public endpoint.
const GOOGLE_BOOKS_API =
  import.meta.env.VITE_GOOGLE_BOOKS_API ||
  "https://www.googleapis.com/books/v1";
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
/**
 * Retrieve detailed info for a specific book using its ID.
 */
export const getBookDetails = async (bookId: string) => {
  // Construct URL: /volumes/{bookId}?key=... (if an API key is provided)
  const url =
    GOOGLE_BOOKS_API +
    "/volumes/" +
    bookId +
    (GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : "");
  const response = await axios.get(url);
  return response.data;
};

export const getReviewsForBook = async (bookTitle: string) => {
  const url = `${REMOTE_SERVER}/api/reviews/book/${encodeURIComponent(
    bookTitle
  )}`;
  const response = await axios.get(url);
  return response.data;
};
