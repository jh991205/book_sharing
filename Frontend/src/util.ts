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
