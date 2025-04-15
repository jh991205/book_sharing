import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    lastName: String,
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    followingList: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  { collection: "users" }
);
export default userSchema;
