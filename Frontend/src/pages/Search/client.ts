import axios from "axios";

// Use an environment variable or fallback to the public endpoint.
const GOOGLE_BOOKS_API =
  import.meta.env.VITE_GOOGLE_BOOKS_API ||
  "https://www.googleapis.com/books/v1";
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export const searchBooks = async (query: string) => {
  const titleQuery = `intitle:${query}`;
  const url =
    GOOGLE_BOOKS_API +
    "/volumes?q=" +
    encodeURIComponent(titleQuery) +
    (GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : "");
  const response = await axios.get(url);
  return response.data.items;
};
