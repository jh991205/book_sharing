import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    _id: String, // optional, you can omit if letting Mongoose auto-generate
    review: {
      type: String,
      ref: "ReviewModel",
      required: true,
    },
    user: {
      type: String,
      ref: "UserModel",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { collection: "tags" }
);

// Enforce unique (user, review) pair — only one tag per user per review
tagSchema.index({ review: 1, user: 1 }, { unique: true });

export default tagSchema;
