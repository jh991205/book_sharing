import { User } from "../../util";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export const updateUser = async (id: string, updates: Partial<User>) => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const getProfile = async () => {
  const res = await fetch(`${REMOTE_SERVER}/api/users/profile`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not logged in");
  return res.json() as Promise<User>;
};
