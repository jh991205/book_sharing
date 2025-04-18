import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("CollectionsModel", schema);
export default model;
