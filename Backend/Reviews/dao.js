import model from "./model.js";

// CREATE
export const createReview = (review) => model.create(review);

// READ
export const findAllReviews = () => model.find();
export const findReviewById = (id) => model.findById(id);

export const findReviewsByUser = (userId) =>
  model.find({ user: userId }).populate("bookDetail");

export const findReviewsByBook = (bookId) =>
  model.find({ bookDetail: bookId }).populate("user");

// UPDATE
export const updateReview = (id, updatedReview) =>
  model.updateOne({ _id: id }, { $set: updatedReview });

// DELETE
export const deleteReview = (id) => model.deleteOne({ _id: id });

export default {
  createReview,
  findAllReviews,
  findReviewById,
  findReviewsByUser,
  findReviewsByBook,
  updateReview,
  deleteReview,
};
