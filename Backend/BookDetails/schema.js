import mongoose from "mongoose";
const bookDetailsSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
  },
  { collection: "bookDetails" }
);
export default bookDetailsSchema;
