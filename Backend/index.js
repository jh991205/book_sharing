import express from "express";

import UserRoutes from "./Users/routes.js";
import BookRoutes from "./Books/routes.js";
import ReviewRoutes from "./Reviews/routes.js";

import cors from "cors";
import "dotenv/config";
import session from "express-session";
import mongoose from "mongoose";
import TagRoutes from "./Tags/routes.js";
import ClassificationRoutes from "./Classification/routes.js";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
BookRoutes(app);
ReviewRoutes(app);
TagRoutes(app);
ClassificationRoutes(app);

app.listen(process.env.PORT || 4001);
