import model from "./model.js";
import userModel from "../Users/model.js";

// CREATE
export const createReview = (review) => model.create(review);

// READ
export const findAllReviews = () => model.find();
export const findReviewsForAdmin = async (adminId) => {
  const users = await userModel.find({ role: "USER" }, "_id");
  const userIds = users.map((u) => u._id.toString());
  userIds.push(adminId);
  return model.find({ user: { $in: userIds } });
};

export const findReviewById = (id) => model.findById(id);

export const findReviewsByUser = (userId) =>
  model.find({ user: userId }).populate("user");

export const findReviewsByBook = (bookTitle) =>
  model.find({ bookTitle: bookTitle });

// UPDATE
export const updateReview = (id, updatedReview) =>
  model.updateOne({ _id: id }, { $set: updatedReview });

// DELETE
export const deleteReview = (id) => model.deleteOne({ _id: id });
