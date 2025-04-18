import model from "./model.js"; // your Book model
import { v4 as uuidv4 } from "uuid";

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

// Delete book by _id
export const deleteBook = (bookId) => model.deleteOne({ _id: bookId });

// Optional: search for books by partial title (case-insensitive)
export const findBooksByPartialTitle = (partialTitle) => {
  const regex = new RegExp(partialTitle, "i");
  return model.find({ bookTitle: { $regex: regex } });
};

export const findBooksByIds = (ids) =>
  model.find({ _id: { $in: ids } }).select("_id bookTitle");
