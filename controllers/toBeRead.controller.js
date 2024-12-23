import { db } from "../app.js";
import axios from "axios";
class ToBeReadController {
  static async createToBeRead(req, res) {
    const user = req.user ||null;
    if(req.isAuthenticated() && user.author == true){
    let { title, author, type } = req.body;
    try {
      const bookDetails = await ToBeReadController.getBookDetails(title);

      if (bookDetails) {
        title = bookDetails.title;
        author = bookDetails.author;
      }

      await db.query(
        "INSERT INTO to_be_read (title, author, type) VALUES ($1, $2, $3)",
        [title, author, type]
      );

      return res.status(201).json({
        status: "success",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: "server error",
      });
    }}else{
      return res.status(401).json({
        status: "error",
        error: "Unauthorized",
      });
    }
  }

  static async getBookDetails(title) {
    if (!title) {
      return null;
    }
    try {
      const searchResponse = await axios.get(
        "https://openlibrary.org/search.json",
        {
          params: {
            title,
            fields: "title,cover_i,author_name,first_publish_year,subject,publisher,isbn",
            limit: 1,
          },
        }
      );

      const book = searchResponse.data.docs[0];
      if (!book) {
        return null;
      }

      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null;

        const newTitle = book.title;
        const isbn = book.isbn ? book.isbn[0] : "Not available";
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";
      const publishYear = book.first_publish_year || "Unknown";
      const genres = book.subject
        ? book.subject.slice(0, 5).join(", ")
        : "Not available";
      const publishers = book.publisher
        ? book.publisher.slice(0, 3).join(", ")
        : "Not available";

      return {
        title:newTitle,
        coverUrl,
        author,
        publishYear,
        genres,
        publishers,
        isbn
      };
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  }

  static async deleteToBeRead(req, res) {
    const user = req.user ||null;
    if(req.isAuthenticated() && user.author == true){
    const { id } = req.params;
    try {
      await db.query("DELETE FROM to_be_read WHERE id = $1", [id]);
      return res.status(200).json({
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        error: "server error",
      });
    }}else{
      return res.status(401).json({
        status: "error",
        error: "Unauthorized",
      });
    }
  }
}

export default ToBeReadController;
