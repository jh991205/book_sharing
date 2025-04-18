import * as dao from "./dao.js";
import { v4 as uuidv4 } from "uuid";

export default function CollectionsRoutes(app) {
  // CREATE
  const createCollection = async (req, res) => {
    const newCollection = {
      _id: uuidv4(),
      ...req.body,
    };
    const created = await dao.createCollection(newCollection);
    res.json(created);
  };

  // GET ALL
  const findAllCollections = async (req, res) => {
    const collections = await dao.findAllCollections();
    res.json(collections);
  };

  // GET BY ID
  const findCollectionById = async (req, res) => {
    const collection = await dao.findCollectionById(req.params.collectionId);
    if (!collection) return res.status(404).json({ message: "Not found" });
    res.json(collection);
  };

  // GET BY USER
  const findCollectionsByUser = async (req, res) => {
    const collections = await dao.findCollectionsByUser(req.params.userId);
    res.json(collections);
  };

  // GET BY BOOK
  const findCollectionsByBook = async (req, res) => {
    const collections = await dao.findCollectionsByBook(req.params.bookId);
    res.json(collections);
  };

  // UPDATE
  const updateCollection = async (req, res) => {
    const status = await dao.updateCollection(
      req.params.collectionId,
      req.body
    );
    res.json(status);
  };

  // DELETE
  const deleteCollection = async (req, res) => {
    const status = await dao.deleteCollection(req.params.collectionId);
    res.json(status);
  };

  // Routes
  app.post("/api/collections", createCollection);
  app.get("/api/collections", findAllCollections);
  app.get("/api/collections/:collectionId", findCollectionById);
  app.get("/api/collections/user/:userId", findCollectionsByUser);
  app.get("/api/collections/book/:bookId", findCollectionsByBook);
  app.put("/api/collections/:collectionId", updateCollection);
  app.delete("/api/collections/:collectionId", deleteCollection);
}
