import mongoose from "mongoose";
import model from "./model.js"; // your Book model
import { v4 as uuidv4 } from "uuid";
import classificationModel from "../Classification/model.js";
import collectionModel from "../Collections/model.js";
import reviewModel from "../Reviews/model.js";
import tagModel from "../Tags/model.js";

export const deleteBook = async (bookId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const book = await model.findById(bookId).session(session);
    if (!book) throw new Error("Book not found");

    const title = book.bookTitle;

    await classificationModel.deleteMany({ bookId }, { session });

    await collectionModel.deleteMany({ bookId }, { session });

    const reviews = await reviewModel.find({ bookTitle: title }, "_id", {
      session,
    });
    const reviewIds = reviews.map((r) => r._id.toString());
    await reviewModel.deleteMany({ bookTitle: title }, { session });

    if (reviewIds.length > 0) {
      await tagModel.deleteMany({ review: { $in: reviewIds } }, { session });
    }

    await model.deleteOne({ _id: bookId }, { session });

    await session.commitTransaction();
    return { deletedReviewIds: reviewIds };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// Create a new book with UUID as _id
export const createBook = (book) => {
  const newBook = { ...book, _id: uuidv4() };
  return model.create(newBook);
};

// Get all books
export const findAllBooks = () => model.find().sort({ bookTitle: 1 });

// Find book by _id
export const findBookById = (bookId) => model.findById(bookId);

// Find book by exact title
export const findBookByTitle = (title) => model.findOne({ bookTitle: title });

// Update book by _id
export const updateBook = (bookId, book) =>
  model.updateOne({ _id: bookId }, { $set: book });

// Optional: search for books by partial title (case-insensitive)
export const findBooksByPartialTitle = (partialTitle) => {
  const regex = new RegExp(partialTitle, "i");
  return model.find({ bookTitle: { $regex: regex } });
};

export const findBooksByIds = (ids) =>
  model.find({ _id: { $in: ids } }).select("_id bookTitle");
