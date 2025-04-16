import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

// 2) Fetch all stored book titles from our backend
export const findAllBooks = async () => {
  const response = await axios.get(`${REMOTE_SERVER}/api/books`);
  return response.data;
};

// 3) Fetch partial matches from our backend
export const findBooksByPartialTitle = async (name: string) => {
  const response = await axios.get(
    `${REMOTE_SERVER}/api/books/search/${encodeURIComponent(name)}`
  );
  return response.data;
};

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
