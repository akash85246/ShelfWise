import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { unlink } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();
import { db } from "../app.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class AnticipatedController {
  static async createAnticipated(req, res) {
    try {
      const file = req.file;
      const { title, author, releaseDate, emoji } = req.body;
      if (!file || !title || !author || !releaseDate) {
        return res.status(400).json({ error: "data missing" });
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "anticipated_books",
        resource_type: "image",
      });

      await unlink(file.path);

      await db.query(
        "INSERT INTO anticipated_books (title, author, release_date, cdn_link, emoji) VALUES ($1, $2, $3, $4, $5)",
        [title, author, releaseDate, result.secure_url, emoji]
      );

      return res.status(201).json({
        message: "Anticipated book created successfully!",
        cdnLink: result.secure_url,
      });
    } catch (error) {
      console.error("Error creating anticipated book:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again!" });
    }
  }

  static async getAnticipated(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      const result = await db.query(
        "SELECT * FROM anticipated_books ORDER BY release_date ASC LIMIT $1 OFFSET $2",
        [limit, offset]
      );

      const countResult = await db.query(
        "SELECT COUNT(*) FROM anticipated_books"
      );
      const totalBooks = countResult.rows[0].count;
      const totalPages = Math.ceil(totalBooks / limit);

      res.renderWithLayout("anticipated.ejs", {
        listTitle: "Anticipated",
        anticipatedBooks: result.rows,
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalBooks: totalBooks,
      });
    } catch (error) {
      console.error("Error getting anticipated books:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default AnticipatedController;
