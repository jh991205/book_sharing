import model from "./model.js";

// CREATE
export const createReview = (review) => model.create(review);

// READ
export const findAllReviews = () => model.find();
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
