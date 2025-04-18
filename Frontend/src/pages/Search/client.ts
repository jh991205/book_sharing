import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

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

export const followBook = async (userId: string, bookId: string) => {
  const res = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/collections`,
    {
      userId,
      bookId,
    }
  );
  return res.data;
};

export const unfollowBook = async (collectionId: string) => {
  const res = await axiosWithCredentials.delete(
    `${REMOTE_SERVER}/api/collections/${collectionId}`
  );
  return res.data;
};

export const getFollowedCollectionsByUser = async (userId: string) => {
  const res = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/collections/user/${userId}`
  );
  return res.data;
};

export const getBookByTitle = async (title: string) => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/books/title/${encodeURIComponent(title)}`
  );
  return response.data;
};
