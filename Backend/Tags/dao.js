import model from "./model.js";

// Create a new tag
export const createTag = ({ review, user, type }) =>
  model.create({ review, user, type, _id: `${user}-${review}` });

// Find all tags (for admin/testing)
export const findAllTags = () => model.find();

// Find all tags by a specific user
export const findTagsByUser = (userId) => model.find({ user: userId });

// Find all tags for a specific review
export const findTagsForReview = (reviewId) => model.find({ review: reviewId });

// Find a tag for a specific (user, review) pair
export const findUserTagOnReview = (userId, reviewId) =>
  model.findOne({ user: userId, review: reviewId });

// Update an existing tag (e.g., change from like to dislike)
export const updateTag = (id, updated) =>
  model.updateOne({ _id: id }, { $set: updated });

// Delete a tag (e.g., when toggling off)
export const deleteTag = (id) => model.deleteOne({ _id: id });

// Optionally: toggle a tag (logic usually belongs in controller)
