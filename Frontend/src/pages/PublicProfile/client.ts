import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const followUser = async (userId: string, followId: string) => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/users/${userId}/follow/${followId}`
  );
  return response.data;
};

export const unfollowUser = async (userId: string, unfollowId: string) => {
  const response = await axiosWithCredentials.post(
    `${REMOTE_SERVER}/api/users/${userId}/unfollow/${unfollowId}`
  );
  return response.data;
};
