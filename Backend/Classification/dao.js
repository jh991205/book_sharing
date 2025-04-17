import model from "./model.js";
import GenreModel from "../Genres/model.js";

/**
 * Find all genres associated with a given book
 */
export const findGenresByBook = async (bookId) => {
  const classifications = await model.find({ bookId }).populate("genreId");
  return classifications.map((c) => c.genreId);
};

/**
 * Find all books associated with a given genre
 */
export const findBooksByGenre = async (genreId) => {
  const classifications = await model.find({ genreId }).populate("bookId");
  return classifications.map((c) => c.bookId);
};

export function createClassification(bookId, genreId) {
  return model.create({
    bookId,
    genreId,
    _id: `${bookId}-${genreId}`,
  });
}

export function deleteClassification(bookId, genreId) {
  return model.deleteOne({ bookId, genreId });
}

export const deleteClassificationsByBook = async (bookId) => {
  return await model.deleteMany({ bookId });
};

export const deleteClassificationsByGenre = async (genreId) => {
  return await model.deleteMany({ genreId });
};
