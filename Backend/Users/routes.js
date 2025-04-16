import * as dao from "./dao.js";
import { v4 as uuidv4 } from "uuid";

export default function UserRoutes(app) {
  // CREATE account (no session)
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  // DELETE
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  // GET all / filtered
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    res.json(users);
  };

  // GET one by ID
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  // UPDATE
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session.currentUser;
    if (currentUser && currentUser._id === userId) {
      req.session.currentUser = { ...currentUser, ...userUpdates };
    }
    res.json({ status: "ok" });
  };

  // SIGNUP
  const signup = async (req, res) => {
    const existing = await dao.findUserByUsername(req.body.email);
    if (existing) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const newUser = {
      _id: uuidv4(),
      username: req.body.email, // store email as username
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      role: "USER",
    };

    const created = await dao.createUser(newUser);
    req.session.currentUser = created;
    res.json(created);
  };

  // SIGNIN
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await dao.findUserByCredentials(username, password);
    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }
    req.session.currentUser = user;
    res.json(user);
  };

  // SIGNOUT
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  // PROFILE (get logged-in user)
  const profile = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // FOLLOW
  const followUser = async (req, res) => {
    const { userId, followId } = req.params;
    const status = await dao.followUser(userId, followId);
    res.json(status);
  };

  // UNFOLLOW
  const unfollowUser = async (req, res) => {
    const { userId, unfollowId } = req.params;
    const status = await dao.unfollowUser(userId, unfollowId);
    res.json(status);
  };

  // GET FOLLOWING LIST
  const getFollowing = async (req, res) => {
    const user = await dao.getUserWithFollowing(req.params.userId);
    res.json(user?.followingList || []);
  };

  // Routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.post("/api/users/:userId/follow/:followId", followUser);
  app.post("/api/users/:userId/unfollow/:unfollowId", unfollowUser);
  app.get("/api/users/:userId/following", getFollowing);
}
