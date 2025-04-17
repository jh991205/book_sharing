import model from "./model.js";

// CREATE
export const createUser = (user) => model.create(user);

// READ
export const findAllUsers = () => model.find();
export const findUsersByRole = (role) => model.find({ role });

export const findUsersExcludingRole = (excludedRole) =>
  model.find({ role: { $ne: excludedRole } });
export const findUserById = (id) => model.findById(id);
export const findUserByUsername = (username) => model.findOne({ username });
export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

export const findUsersByIds = (ids) =>
  model.find({ _id: { $in: ids } }).select("_id username");

// UPDATE
export const updateUser = (id, updatedUser) =>
  model.updateOne({ _id: id }, { $set: updatedUser });

// DELETE
export const deleteUser = (id) => model.deleteOne({ _id: id });

// FOLLOWING
export const followUser = (userId, followId) =>
  model.updateOne({ _id: userId }, { $addToSet: { followingList: followId } });

export const unfollowUser = (userId, unfollowId) =>
  model.updateOne({ _id: userId }, { $pull: { followingList: unfollowId } });

// Optional: populate followingList with user details
export const getUserWithFollowing = (userId) =>
  model.findById(userId).populate("followingList");
