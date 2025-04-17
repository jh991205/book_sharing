import { User } from "../../util";
import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/users/signin`,
    { username, password }
  );
  return response.data;
};

export const registerUser = async (payload: {
  username: string;
  password: string;
  email: string;
}): Promise<User> => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/users/signup`,
    payload
  );
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosWithCredentials.post(`${REMOTE_SERVER}/api/users/signout`);
};
