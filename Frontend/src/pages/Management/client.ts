import { User, Book, Review } from "../../util";
import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users`);
  return response.data;
};

export const deleteUserById = async (id: string): Promise<void> => {
  await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/users/${id}`);
};

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/books`);
  return response.data;
};

export const deleteBookById = async (id: string): Promise<void> => {
  await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/books/${id}`);
};

export const getAllReviews = async (): Promise<Review[]> => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/reviews`
  );
  return response.data;
};

export const deleteReviewById = async (id: string): Promise<void> => {
  await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/reviews/${id}`);
};

export const deleteReviewsByUser = async (userId: string): Promise<void> => {
  await axiosWithCredentials.delete(
    `${REMOTE_SERVER}/api/reviews/user/${userId}`
  );
};

export const deleteTagsByUser = async (userId: string): Promise<void> => {
  await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/tags/user/${userId}`);
};

export const deleteCollectionsByUser = async (
  userId: string
): Promise<void> => {
  await axiosWithCredentials.delete(
    `${REMOTE_SERVER}/api/collections/user/${userId}`
  );
};

export const deleteTagsByReview = async (reviewId: string): Promise<void> => {
  await axiosWithCredentials.delete(
    `${REMOTE_SERVER}/api/tags/review/${reviewId}`
  );
};
