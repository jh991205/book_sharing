import * as dao from "./dao.js";

export default function ReviewRoutes(app) {
  const createReview = async (req, res) => {
    const review = await dao.createReview(req.body);
    res.json(review);
  };

  const findAllReviews = async (req, res) => {
    const reviews = await dao.findAllReviews();
    res.json(reviews);
  };

  const findReviewById = async (req, res) => {
    const review = await dao.findReviewById(req.params.reviewId);
    res.json(review);
  };

  const findReviewsByUser = async (req, res) => {
    const reviews = await dao.findReviewsByUser(req.params.userId);
    res.json(reviews);
  };

  // Updated: 'bookTitle' now is used as the identifier for the book
  const findReviewsByBook = async (req, res) => {
    const reviews = await dao.findReviewsByBook(req.params.bookTitle);
    res.json(reviews);
  };

  const updateReview = async (req, res) => {
    const status = await dao.updateReview(req.params.reviewId, req.body);
    res.json(status);
  };

  const deleteReview = async (req, res) => {
    const status = await dao.deleteReview(req.params.reviewId);
    res.json(status);
  };

  // Routes
  app.post("/api/reviews", createReview);
  app.get("/api/reviews", findAllReviews);
  app.get("/api/reviews/:reviewId", findReviewById);
  app.get("/api/reviews/user/:userId", findReviewsByUser);
  // Note: use /api/reviews/book/:bookTitle so that clients pass a canonical book title.
  app.get("/api/reviews/book/:bookTitle", findReviewsByBook);
  app.put("/api/reviews/:reviewId", updateReview);
  app.delete("/api/reviews/:reviewId", deleteReview);
}
