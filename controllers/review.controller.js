import slugify from "slug";
import { db } from "../app.js";
import axios from "axios";
const cache = new Map();
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
        moment_page_number,
      } = req.body;

      const final_rating = Math.ceil(
        (Number(setting_rating) +
          Number(plot_rating) +
          Number(character_rating) +
          Number(style_rating) +
          Number(engagement_rating)) /
          5
      );

     
      const slugField = slugify(title, { lower: true });
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
          final_rating,
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
        moment_page_number,
      } = req.body;

      const review = await db.query(
        "SELECT * FROM book_reviews WHERE slug = $1",
        [slug]
      );


      if (review.rows.length === 0) {
        return res.status(404).json({ message: "Review not found to update" });
      }

      let newSlug = slug;

      if (review.rows[0].title !== title) {
        newSlug = slugify(title, { lower: true });
      }
      const final_rating = Math.ceil(
        (Number(setting_rating) +
          Number(plot_rating) +
          Number(character_rating) +
          Number(style_rating) +
          Number(engagement_rating)) /
          5
      );

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
          slug = $18,
          final_rating = $19,
          moment_page_number = $20
        WHERE slug = $21`,
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
          final_rating,
          moment_page_number || review.rows[0].moment_page_number,
          review.rows[0].slug,
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
      const {
        sortBy,
        bookByGenre,
        recommendation,
        page = 1,
        limit = 10,
      } = req.query;

      const offset = (page - 1) * limit;
      let query = "";
      const params = [];

      if (recommendation) {
        // Handle specific recommendations
        if (recommendation === "Artist of the Month") {
          query = `
            SELECT author, COUNT(*) AS review_count
            FROM book_reviews
            GROUP BY author
            ORDER BY review_count DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        } else if (recommendation === "Book of the Year") {
          query = `
            SELECT title, views, final_rating
            FROM book_reviews
            ORDER BY views DESC, final_rating DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        } else if (recommendation === "Top Genre") {
          query = `
            WITH top_genre AS (
              SELECT genre
              FROM book_reviews
              GROUP BY genre
              ORDER BY COUNT(*) DESC
              LIMIT 1
            )
            SELECT *
            FROM book_reviews
            WHERE genre = (SELECT genre FROM top_genre)
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        } else if (recommendation === "Trending") {
          query = `
            SELECT title, views, final_rating, created_at
            FROM book_reviews
            WHERE created_at > NOW() - INTERVAL '1 MONTH'
            ORDER BY views DESC, final_rating DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        }
      } else {
        // Default query for filtering by sortBy and bookByGenre
        query = `
          SELECT *
          FROM book_reviews
          WHERE 1=1
        `;

        // Filter by book genre
        if (bookByGenre) {
          query += ` AND LOWER(genre) = $${params.length + 1}`;
          params.push(bookByGenre.toLowerCase());
        }

        // Sorting
        if (sortBy) {
          const validSortOptions = ["Title", "Best", "Newest"];
          let sorting = "";
          if (sortBy === "Title") {
            sorting = "title ASC";
          } else if (sortBy === "Best") {
            sorting = "final_rating DESC";
          } else if (sortBy === "Newest") {
            sorting = "created_at DESC";
          }

          if (validSortOptions.includes(sortBy)) {
            query += ` ORDER BY ${sorting}`;
          } else {
            return res.status(400).json({ message: "Invalid sortBy value" });
          }
        } else {
          query += ` ORDER BY created_at DESC`;
        }

        // Add pagination
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
      }

      // Execute query
      const result = await db.query(query, params);

      // Enrich results with external API
      const enrichBooks = async (books) => {
        return Promise.all(
          books.map(async (book) => {
            const details = await ReviewController.getBookDetailsWithCache(book.title);
            return { ...book, ...details };
          })
        );
      };

      const detailedResult = await enrichBooks(result.rows);
      res.status(200).json({
        data: detailedResult,
        page,
        limit,
        total: result.rowCount,
      });
    } catch (error) {
      console.error("Error filtering reviews:", error);
      res.status(500).json({ message: "Error filtering reviews: " + error.message });
    }
  }

  static async getBookDetails(title) {
    if (!title) {
      return null;
    }
    try {
      const searchResponse = await axios.get("https://openlibrary.org/search.json", {
        params: {
          title,
          fields: "cover_i,author_name,first_publish_year,subject,publisher",
          limit: 1,
        },
      });

      const book = searchResponse.data.docs[0];
      if (!book) {
        return null;
      }

      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null;
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";
      const publishYear = book.first_publish_year || "Unknown";
      const genres = book.subject ? book.subject.slice(0, 5).join(", ") : "Not available";
      const publishers = book.publisher ? book.publisher.slice(0, 3).join(", ") : "Not available";

      return {
        coverUrl,
        author,
        publishYear,
        genres,
        publishers,
      };
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  }

  static async getBookDetailsWithCache(title) {
    if (!title) return null;
    if (cache.has(title)) {
      return cache.get(title);
    }
    const details = await this.getBookDetails(title);
    if (details) {
      cache.set(title, details);
    }

    return details;
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
        return res.status(404).json({ message: "Review not found to edit" });
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
      const genres = book.subject
        ? book.subject.join(", ").slice(0, 100)
        : "Not available";
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
        return res
          .status(404)
          .json({ message: "Review not found to get book review" });
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
      const genres = book.subject
        ? book.subject.join(", ").slice(0, 100)
        : "Not available";
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
