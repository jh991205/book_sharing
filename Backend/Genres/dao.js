import model from "./model.js";
import mongoose from "mongoose";

export const findAllGenres = () => model.find();
