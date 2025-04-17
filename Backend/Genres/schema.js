import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    collection: "genres",
  }
);

export default genreSchema;
