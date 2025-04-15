import mongoose from "mongoose";
const reviewsSchema = new mongoose.Schema({
  _id: String,
  contentReview: String,
  ratings: Number,
  user: { type: String, ref: "UserModel" },
  bookDetail: { type: String, ref: "BookDetailsModel" },
});
export default reviewsSchema;
