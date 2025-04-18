import model from "./model.js";

// CREATE
export const createCollection = (collection) => model.create(collection);

// READ
export const findAllCollections = () => model.find();
export const findCollectionById = (id) => model.findById(id);
export const findCollectionsByUser = (userId) => model.find({ userId });
export const findCollectionsByBook = (bookId) => model.find({ bookId });

// UPDATE
export const updateCollection = (id, updates) =>
  model.updateOne({ _id: id }, { $set: updates });

// DELETE
export const deleteCollection = (id) => model.deleteOne({ _id: id });

export const deleteCollectionsByUser = (userId) => model.deleteMany({ userId });
