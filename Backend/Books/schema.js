import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
  {
    _id: String,
    bookTitle: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "books",
  }
);
export default bookSchema;
