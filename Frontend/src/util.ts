export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  password: string;
  followingList: string[];
}

export interface Book {
  _id: string;
  bookTitle: string;
}

export interface Review {
  _id: string;
  contentReview: string;
  ratings: number;
  user: string;
  bookTitle: String;
}

export const getUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
};

export const getReviewsByUser = async (id: string): Promise<Review[]> => {
  const res = await fetch(`${REMOTE_SERVER}/api/reviews/user/${id}`);
  if (!res.ok) throw new Error("Reviews not found");
  return res.json();
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/signin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json() as Promise<User>;
};

export const registerUser = async (payload: {
  username: string;
  password: string;
  email: string;
}) => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json() as Promise<User>;
};

// BOOKS
export const getRandomBooks = async () => {
  const res = await fetch(`${REMOTE_SERVER}/api/books`);
  const books = (await res.json()) as Book[];
  return books.sort(() => 0.5 - Math.random()).slice(0, 5);
};

export const getBookById = async (bookId: string): Promise<Book> => {
  const res = await fetch(`${REMOTE_SERVER}/api/books/${bookId}`);
  if (!res.ok) throw new Error("Book not found");
  return res.json();
};

export const getReviewsByBook = async (bookId: string): Promise<Review[]> => {
  const res = await fetch(`${REMOTE_SERVER}/api/reviews/book/${bookId}`);
  if (!res.ok) throw new Error("Reviews not found");
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/signout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
};

export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${REMOTE_SERVER}/api/users`, {
    credentials: "include",
  });
  return res.json();
};

export const deleteUserById = async (id: string) => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
};

export const getAllBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${REMOTE_SERVER}/api/books`, {
    credentials: "include",
  });
  return res.json();
};

export const deleteBookById = async (id: string) => {
  const res = await fetch(`${REMOTE_SERVER}/api/books/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete book");
};

export const getAllReviews = async (): Promise<Review[]> => {
  const res = await fetch(`${REMOTE_SERVER}/api/reviews`, {
    credentials: "include",
  });
  return res.json();
};

export const deleteReviewById = async (id: string) => {
  const res = await fetch(`${REMOTE_SERVER}/api/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete review");
};
