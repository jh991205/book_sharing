import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("ClassificationModel", schema);
export default model;
