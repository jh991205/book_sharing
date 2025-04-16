import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("TagModel", schema);
export default model;
