import * as dao from "./dao.js";

export default function BookRoutes(app) {
  const createBook = async (req, res) => {
    const book = await dao.createBook(req.body);
    res.json(book);
  };

  const findAllBooks = async (req, res) => {
    const books = await dao.findAllBooks();
    res.json(books);
  };

  const findBookById = async (req, res) => {
    const book = await dao.findBookById(req.params.bookId);
    res.json(book);
  };

  const updateBook = async (req, res) => {
    const status = await dao.updateBook(req.params.bookId, req.body);
    res.json(status);
  };

  const deleteBook = async (req, res) => {
    const status = await dao.deleteBook(req.params.bookId);
    res.json(status);
  };

  // Routes
  app.post("/api/books", createBook);
  app.get("/api/books", findAllBooks);
  app.get("/api/books/:bookId", findBookById);
  app.put("/api/books/:bookId", updateBook);
  app.delete("/api/books/:bookId", deleteBook);
}
