import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    _id: String,
    contentReview: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    // Instead of linking to a specific edition, we store the canonical book title
    bookTitle: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: "reviews" }
);

export default reviewsSchema;
