import model from "./model.js";

// CREATE
export const createBook = (book) => model.create(book);

// READ
export const findAllBooks = () => model.find();
export const findBookById = (id) => model.findById(id);

// UPDATE
export const updateBook = (id, updatedBook) =>
  model.updateOne({ _id: id }, { $set: updatedBook });

// DELETE
export const deleteBook = (id) => model.deleteOne({ _id: id });

export default {
  createBook,
  findAllBooks,
  findBookById,
  updateBook,
  deleteBook,
};
