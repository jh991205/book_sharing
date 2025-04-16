import * as dao from "./dao.js";

export default function BookRoutes(app) {
  const createBook = async (req, res) => {
    try {
      const book = await dao.createBook(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  const findAllBooks = async (req, res) => {
    const books = await dao.findAllBooks();
    res.json(books);
  };

  const findBookById = async (req, res) => {
    const book = await dao.findBookById(req.params.bookId);
    if (book) res.json(book);
    else res.status(404).json({ error: "Book not found" });
  };

  const findBookByTitle = async (req, res) => {
    const book = await dao.findBookByTitle(req.params.title);
    if (book) res.json(book);
    else res.status(404).json({ error: "Book not found" });
  };

  const updateBook = async (req, res) => {
    const { bookId } = req.params;
    const bookUpdates = req.body;
    const result = await dao.updateBook(bookId, bookUpdates);
    res.json(result);
  };

  const deleteBook = async (req, res) => {
    const status = await dao.deleteBook(req.params.bookId);
    res.json(status);
  };

  const findBooksByPartialTitle = async (req, res) => {
    const books = await dao.findBooksByPartialTitle(req.params.partial);
    res.json(books);
  };

  app.post("/api/books", createBook);
  app.get("/api/books", findAllBooks);
  app.get("/api/books/:bookId", findBookById);
  app.get("/api/books/title/:title", findBookByTitle);
  app.get("/api/books/search/:partial", findBooksByPartialTitle);
  app.put("/api/books/:bookId", updateBook);
  app.delete("/api/books/:bookId", deleteBook);
}
