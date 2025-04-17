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
