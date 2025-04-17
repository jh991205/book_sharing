import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("GenreModel", schema);
export default model;
