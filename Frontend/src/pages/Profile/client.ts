import { User, Review } from "../../util";
import axios from "axios";
import { Book } from "../../util";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const updateUser = async (id: string, updates: Partial<User>) => {
  const response = await axiosWithCredentials.put(
    `${REMOTE_SERVER}/api/users/${id}`,
    updates
  );
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/users/profile`
  );
  return response.data;
};

export const getUsersByIds = async (ids: string[]): Promise<User[]> => {
  const response = await axiosWithCredentials.post<User[]>(
    `${REMOTE_SERVER}/api/users/batch`,
    { ids }
  );
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosWithCredentials.get<User>(
    `${REMOTE_SERVER}/api/users/${id}`
  );
  return response.data;
};

export const getReviewsByUser = async (id: string): Promise<Review[]> => {
  const response = await axiosWithCredentials.get<Review[]>(
    `${REMOTE_SERVER}/api/reviews/user/${id}`
  );
  return response.data;
};

export const getFollowedBooks = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/collections/user/${userId}`
  );
  return response.data;
};

export const getBooksByIds = async (ids: string[]): Promise<Book[]> => {
  const response = await axiosWithCredentials.post<Book[]>(
    `${REMOTE_SERVER}/api/books/batch`,
    { ids }
  );
  return response.data;
};
