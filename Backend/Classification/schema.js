import mongoose from "mongoose";

const classificationSchema = new mongoose.Schema(
  {
    _id: String,
    bookId: {
      type: String,
      ref: "BookModel",
      required: true,
    },
    genreId: {
      type: String,
      ref: "GenreModel",
      required: true,
    },
  },
  {
    collection: "classifications",
  }
);

export default classificationSchema;
