import { Book } from "../../util";
import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const getRandomBooks = async (): Promise<Book[]> => {
  const response = await axiosWithCredentials.get<Book[]>(
    `${REMOTE_SERVER}/api/books`
  );
  const books = response.data;
  return books.sort(() => 0.5 - Math.random()).slice(0, 5);
};
