import * as dao from "./dao.js";

export default function ClassificationRoutes(app) {
  // Create a new classification (assign a genre to a book)
  app.post("/classification/:bookId/:genreId", async (req, res, next) => {
    const { bookId, genreId } = req.params;
    try {
      const result = await dao.createClassification(bookId, genreId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  // Remove a classification (unassign a genre from a book)
  app.delete("/classification/:bookId/:genreId", async (req, res, next) => {
    const { bookId, genreId } = req.params;
    try {
      await dao.deleteClassification(bookId, genreId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // Delete all classifications for a given book
  app.delete("/classifications/book/:bookId", async (req, res, next) => {
    const { bookId } = req.params;
    try {
      await dao.deleteClassificationsByBook(bookId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // Delete all classifications for a given genre
  app.delete("/classifications/genre/:genreId", async (req, res, next) => {
    const { genreId } = req.params;
    try {
      await dao.deleteClassificationsByGenre(genreId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // Get all genres for a book
  app.get("/api/book/:bookId/genres", async (req, res, next) => {
    const { bookId } = req.params;
    try {
      const genres = await dao.findGenresByBook(bookId);
      res.json(genres);
    } catch (err) {
      next(err);
    }
  });

  // Get all books for a genre
  app.get("/genre/:genreId/books", async (req, res, next) => {
    const { genreId } = req.params;
    try {
      const books = await dao.findBooksByGenre(genreId);
      res.json(books);
    } catch (err) {
      next(err);
    }
  });
}
