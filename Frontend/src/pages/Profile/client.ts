import { User } from "../../util";
import axios from "axios";
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
