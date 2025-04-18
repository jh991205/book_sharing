import mongoose from "mongoose";

const collectionsSchema = new mongoose.Schema(
  {
    _id: String,
    bookId: {
      type: String,
      ref: "BookModel",
      required: true,
    },
    userId: {
      type: String,
      ref: "UserModel",
      required: true,
    },
  },
  {
    collection: "collections",
  }
);

export default collectionsSchema;
