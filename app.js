import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import router from "./routes/index.js";
import userRouter from "./routes/users.js";
import reviewRouter from "./routes/review.js";
import axios from "axios";
import cors from "cors";

dotenv.config();
const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.error("Database connection error:", err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.renderWithLayout = (view, options = {}) => {
    res.render("layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithShowLayout = (view, options = {}) => {
    res.render("show.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithEditLayout = (view, options = {}) => {
    res.render("edit.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use("/", router);
app.use("/api", userRouter);
app.use("/api", reviewRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { db };