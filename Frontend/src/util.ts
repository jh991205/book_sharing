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
