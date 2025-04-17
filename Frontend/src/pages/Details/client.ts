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

export const getTagsForReview = async (reviewId: string) => {
  const response = await axios.get(
    `${REMOTE_SERVER}/api/tags/review/${reviewId}`
  );
  return response.data;
};
export const getGenresForBook = async (bookTitle: string) => {
  // 1. Look up the book by title
  const { data: book } = await axios.get(
    `${REMOTE_SERVER}/api/books/title/${encodeURIComponent(bookTitle)}`
  );

  // If no book found, return empty array
  if (!book) return [];

  // 2. Fetch the genres by the book's ID
  const { data: genres } = await axios.get(
    `${REMOTE_SERVER}/api/book/${book._id}/genres`
  );
  return genres;
};
/**
 * Like (or toggle) a particular review by the current user.
 */
export const likeReview = async (reviewId: string, userId: string) => {
  const payload = { review: reviewId, user: userId, type: "like" };
  const response = await axios.post(`${REMOTE_SERVER}/api/tags`, payload);
  return response.data;
};

/**
 * Dislike (or toggle) a particular review by the current user.
 */
export const dislikeReview = async (reviewId: string, userId: string) => {
  const payload = { review: reviewId, user: userId, type: "dislike" };
  const response = await axios.post(`${REMOTE_SERVER}/api/tags`, payload);
  return response.data;
};

export const createReview = async (
  bookTitle: string,
  userId: string,
  rating: number,
  content: string
) => {
  const payload = {
    bookTitle,
    user: userId,
    ratings: rating,
    contentReview: content,
  };
  const { data } = await axios.post(`${REMOTE_SERVER}/api/reviews`, payload);
  return data;
};
