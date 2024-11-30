import slug from "slug";
import { db } from "../app.js";
import axios from "axios";
class ReviewController {
  static async createReview(req, res) {
    try {
      const {
        title,
        author,
        setting_rating,
        plot_rating,
        character_rating,
        style_rating,
        engagement_rating,
        note,
        quote,
        moment,
        favorite_character,
        least_favorite_character,
        ending,
        start_date,
        end_date,
        genre,
        format,
        moment_page_number
      } = req.body;

      const final_rating = Math.ceil((
        Number(setting_rating) + 
        Number(plot_rating) + 
        Number(character_rating) + 
        Number(style_rating) + 
        Number(engagement_rating)
      ) / 5);

      console.log("final_rating", final_rating);
      const slugField = slug(title, { lower: true });
      await db.query(
        "INSERT INTO book_reviews (title, author, setting_rating, plot_rating, character_rating, style_rating, engagement_rating, note, quote, moment, favorite_character, least_favorite_character, ending, start_date, end_date, genre, format, slug,moment_page_number,final_rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,$19,$20)",
        [
          title,
          author,
          setting_rating,
          plot_rating,
          character_rating,
          style_rating,
          engagement_rating,
          note,
          quote,
          moment,
          favorite_character,
          least_favorite_character,
          ending,
          start_date,
          end_date,
          genre,
          format,
          slugField,
          moment_page_number,
          final_rating
        ]
      );

      res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
      console.error("Error creating review:", error);
      res
        .status(500)
        .json({ message: "Error creating review: " + error.message });
    }
  }

  static async getReviews(req, res) {
    try {
      const { page, limit } = req.query;
      const offset = (page - 1) * limit;
      const reviews = await db.query(
        `SELECT * FROM book_reviews LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      res.status(200).json(reviews.rows);
    } catch (error) {
      console.error("Error getting reviews:", error);
      res
        .status(500)
        .json({ message: "Error getting reviews: " + error.message });
    }
  }

  static async updateReview(req, res) {
    try {
      const { slug } = req.params;
      const {
        title,
        author,
        setting_rating,
        plot_rating,
        character_rating,
        style_rating,
        engagement_rating,
        note,
        quote,
        moment,
        favorite_character,
        least_favorite_character,
        ending,
        start_date,
        end_date,
        genre,
        format,
      } = req.body;

      const review = await db.query(
        "SELECT * FROM book_reviews WHERE slug = $1",
        [slug]
      );

      if (review.rows.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      let newSlug = slug;

      if (review.rows[0].title !== title) {
        newSlug = slugify(title, { lower: true });
      }

      await db.query(
        `UPDATE book_reviews SET 
          title = $1, 
          author = $2, 
          setting_rating = $3, 
          plot_rating = $4, 
          character_rating = $5, 
          style_rating = $6, 
          engagement_rating = $7, 
          note = $8, 
          quote = $9, 
          moment = $10, 
          favorite_character = $11, 
          least_favorite_character = $12, 
          ending = $13, 
          start_date = $14, 
          end_date = $15, 
          genre = $16, 
          format = $17, 
          slug = $18
        WHERE slug = $19`,
        [
          title || review.rows[0].title,
          author || review.rows[0].author,
          setting_rating || review.rows[0].setting_rating,
          plot_rating || review.rows[0].plot_rating,
          character_rating || review.rows[0].character_rating,
          style_rating || review.rows[0].style_rating,
          engagement_rating || review.rows[0].engagement_rating,
          note || review.rows[0].note,
          quote || review.rows[0].quote,
          moment || review.rows[0].moment,
          favorite_character || review.rows[0].favorite_character,
          least_favorite_character || review.rows[0].least_favorite_character,
          ending || review.rows[0].ending,
          start_date || review.rows[0].start_date,
          end_date || review.rows[0].end_date,
          genre || review.rows[0].genre,
          format || review.rows[0].format,
          newSlug,
        ]
      );

      res.status(200).json({ message: "Review updated successfully" });
    } catch (error) {
      console.error("Error updating review:", error);
      res
        .status(500)
        .json({ message: "Error updating review: " + error.message });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { slug } = req.params;
      await db.query("DELETE FROM book_reviews WHERE slug = $1", [slug]);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res
        .status(500)
        .json({ message: "Error deleting review: " + error.message });
    }
  }

  static async filterReviews(req, res) {
    try {
      const { sort, genre, recommended, page = 1, limit = 10 } = req.query;
      let query = "SELECT * FROM book_reviews";
      let queryParams = [];
      let sortOrder = "ASC";

      const offset = (page - 1) * limit;

      if (sort === "title") {
        query += " ORDER BY title " + sortOrder;
      } else if (sort === "newest") {
        query += " ORDER BY start_date DESC";
      } else if (sort === "best") {
        query += " ORDER BY final_rating DESC";
      }

      if (genre) {
        query += query.includes("WHERE")
          ? " AND genre = $1"
          : " WHERE genre = $1";
        queryParams.push(genre);
      }

      if (recommended) {
        if (recommended === "artist") {
          query = `SELECT * FROM book_reviews WHERE author = (SELECT author FROM book_reviews GROUP BY author ORDER BY COUNT(*) DESC LIMIT 1)`;
        } else if (recommended === "genre") {
          query = `SELECT * FROM book_reviews WHERE genre = (SELECT genre FROM book_reviews GROUP BY genre ORDER BY COUNT(*) DESC LIMIT 1)`;
        } else if (recommended === "book") {
          query += query.includes("WHERE")
            ? " AND views > 100 AND final_rating > 4"
            : " WHERE views > 100 AND final_rating > 4";
        } else if (recommended === "trending") {
          query = `SELECT * FROM book_reviews ORDER BY views DESC LIMIT 10`;
        }
      }

      query += ` LIMIT $${queryParams.length + 1} OFFSET $${
        queryParams.length + 2
      }`;
      queryParams.push(limit, offset);

      const reviews = await db.query(query, queryParams);

      res.json(reviews.rows);
    } catch (error) {
      console.error("Error filtering reviews:", error);
      res
        .status(500)
        .json({ message: "Error filtering reviews: " + error.message });
    }
  }

  static async searchReviews(req, res) {
    const { query, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const reviews = await db.query(
      `SELECT * FROM book_reviews WHERE title ILIKE $1 LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );
    res.json(reviews.rows);
  }

  static async getEditBookReview(req, res) {
    try {
      const { slug } = req.params;
      const result = await db.query(
        "SELECT * FROM book_reviews WHERE slug = $1",
        [slug]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      
      const review = result.rows[0];
      

      const searchResponse = await axios.get(
        `https://openlibrary.org/search.json`,
        { params: { title: review.title } }
      );

      const book = searchResponse.data.docs[0];
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";
      const publishYear = book.first_publish_year || "Unknown";
      const genres = book.subject ? book.subject.join(", ").slice(0,100) : "Not available";
      const publishers = book.publisher
        ? book.publisher.slice(0, 3).join(", ")
        : "Not available";
      const ISBN = book.isbn ? book.isbn[0] : "Not available";
      const title = book.title;


      const enrichedReview = {
        ...review,
        title,
        coverUrl,
        author,
        publishYear,
        genres,
        publishers,
        ISBN,
      };
      
      res.renderWithEditLayout("edit.ejs", {
        listTitle: "review.slug",
        review: enrichedReview,
      });
    } catch (error) {
      console.error("Error retrieving review:", error);
      res
        .status(500)
        .json({ message: "Error retrieving review: " + error.message });
    }
  }

  static async getBookReview(req, res) {
    try {
      const { slug } = req.params;
      const result = await db.query(
        "SELECT * FROM book_reviews WHERE slug = $1",
        [slug]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      
      const review = result.rows[0];
      

      const searchResponse = await axios.get(
        `https://openlibrary.org/search.json`,
        { params: { title: review.title } }
      );

      const book = searchResponse.data.docs[0];
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";
      const publishYear = book.first_publish_year || "Unknown";
      const genres = book.subject ? book.subject.join(", ") : "Not available";
      const publishers = book.publisher
        ? book.publisher.slice(0, 3).join(", ")
        : "Not available";
      const ISBN = book.isbn ? book.isbn[0] : "Not available";
      const title = book.title;


      const enrichedReview = {
        ...review,
        title,
        coverUrl,
        author,
        publishYear,
        genres,
        publishers,
        ISBN,
      };
      
      res.renderWithShowLayout("show.ejs", {
        listTitle: "review.slug",
        review: enrichedReview,
      });
    } catch (error) {
      console.error("Error retrieving review:", error);
      res
        .status(500)
        .json({ message: "Error retrieving review: " + error.message });
    }
  }

  static async getBookCoverByTitle(req, res) {
    const { title } = req.query;
    console.log("title", title);
    try {
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const searchResponse = await axios.get(
        `https://openlibrary.org/search.json`,
        { params: { title } }
      );

      const book = searchResponse.data.docs[0];
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";
      const publishYear = book.first_publish_year || "Unknown";
      const genres = book.subject ? book.subject.join(", ").slice(0, 100) : "Not available";
      const publishers = book.publisher
        ? book.publisher.slice(0, 3).join(", ")
        : "Not available";
      const subjects = book.subject ? book.subject.join(", ") : "Not available";
      return res
        .status(200)
        .json({ coverUrl, author, publishYear, genres, publishers, subjects });
    } catch (error) {
      console.error("Error fetching book cover:", error.message);
      return res
        .status(500)
        .json({ message: "Error fetching book cover: " + error.message });
    }
  }
}

export default ReviewController;
