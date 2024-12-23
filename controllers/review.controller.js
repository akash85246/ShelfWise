import slugify from "slug";
import { db } from "../app.js";
import axios from "axios";
import slug from "slug";
import e from "express";
const cache = new Map();
class ReviewController {
  static async createReview(req, res) {
    try {
      let {
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

      const additionalDetails = await ReviewController.getBookDetails(title);
      title = additionalDetails.title;
      author = additionalDetails.author;
      const coverUrl = additionalDetails.coverUrl;
      const publishers = additionalDetails.publishers;
      const isbn = additionalDetails.isbn;
      const published_year = additionalDetails.publishYear;
      const slugField = slugify(title, { lower: true });

      await db.query(
        "INSERT INTO book_reviews (title, author, setting_rating, plot_rating, character_rating, style_rating, engagement_rating, note, quote, moment, favorite_character, least_favorite_character, ending, start_date, end_date, genre, format, slug,moment_page_number,final_rating,cover_url,isbn,publisher,published_year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,$19,$20,$21,$22,$23,$24)",
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
          coverUrl,
          isbn,
          publishers,
          published_year,
        ]
      );
      await ReviewController.deleteReadLater(title);
      res
        .status(201)
        .json({ slug: slugField, message: "Review created successfully" });
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
      let {
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

      const additionalDetails = await ReviewController.getBookDetails(title);

      title = additionalDetails.title;
      author = additionalDetails.author;
      const coverUrl = additionalDetails.coverUrl;
      const publishers = additionalDetails.publishers;
      const isbn = additionalDetails.isbn;
      const published_year = additionalDetails.publishYear;
      genre = genre.trim();

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
          moment_page_number = $20,
          cover_url = $21,
          isbn = $22,
          publisher = $23,
          published_year = $24
        WHERE slug = $25`,
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
          genre || review.rows[0].genre.trim(),
          format || review.rows[0].format,
          newSlug,
          final_rating,
          moment_page_number || review.rows[0].moment_page_number,
          coverUrl,
          isbn,
          publishers,
          published_year,
          review.rows[0].slug,
        ]
      );
      await ReviewController.deleteReadLater(title);
      res
        .status(200)
        .json({ slug: newSlug, message: "Review updated successfully" });
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
            SELECT title,slug,cover_url,author, COUNT(*) AS review_count
            FROM book_reviews
            GROUP BY title, slug, author,cover_url
            ORDER BY review_count DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        } else if (recommendation === "Book of the Year") {
          query = `
            SELECT author,title,cover_url, views, final_rating,slug
            FROM book_reviews
            ORDER BY views DESC, final_rating DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        } else if (recommendation === "Top Genre") {
          query = `
            WITH top_genre AS (
              SELECT  author,genre,cover_url,title,slug
              FROM book_reviews
              GROUP BY genre,cover_url,title,slug,author
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
            SELECT author,title,cover_url, views, final_rating, created_at,slug
            FROM book_reviews
            WHERE created_at > NOW() - INTERVAL '1 MONTH'
            ORDER BY views DESC, final_rating DESC
            LIMIT $1 OFFSET $2;
          `;
          params.push(limit, offset);
        }
      } else {
        query = `
          SELECT *
          FROM book_reviews
          WHERE 1=1
        `;

        // Filter by book genre
        if (bookByGenre !== "All" || bookByGenre !== "all") {
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
      res.status(200).json({
        data: result.rows,
        page,
        limit,
        total: result.rowCount,
      });
    } catch (error) {
      console.error("Error filtering reviews:", error);
      res
        .status(500)
        .json({ message: "Error filtering reviews: " + error.message });
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
            fields:
              "title,cover_i,author_name,first_publish_year,subject,publisher,isbn",
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

      let genres = book.subject ? book.subject : [];
      let a = 0;
      let finalGenres = [];
      for (let genre of genres) {
        const genreLength = genre.length + (finalGenres.length > 0 ? 2 : 0);

        if (a + genreLength <= 100) {
          finalGenres.push(genre);
          a += genre.length;
        } else {
          break;
        }
      }
      const genresString =
        finalGenres.length > 0 ? finalGenres.join(", ") : "Not available";
      genres = genresString;

      let publishers = book.publisher ? book.publisher : [];
      let totalLength = 0;
      let finalPublishers = [];
      for (let publisher of publishers) {
        const publisherLength =
          publisher.length + (finalPublishers.length > 0 ? 2 : 0);
        if (totalLength + publisherLength <= 100) {
          finalPublishers.push(publisher);
          totalLength += publisher.length;
        } else {
          break;
        }
      }
      const publishersString =
        finalPublishers.length > 0
          ? finalPublishers.join(", ")
          : "Not available";
      publishers = publishersString.trim();

      return {
        title: newTitle,
        coverUrl,
        author,
        publishYear,
        genres,
        publishers,
        isbn,
      };
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  }
//used to delete a book from the to be read list in this controller only mo route is made for this
  static async deleteReadLater(title) {
    try {
      db.query("DELETE FROM to_be_read WHERE title = $1", [title]);
    } catch (error) {
      console.error("Error deleting read later:", error);
      res
        .status(500)
        .json({ message: "Error deleting read later: " + error.message });
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
    const user = req.user || null;
    if (req.isAuthenticated() && user.author == true) {
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

        res.renderWithEditLayout("edit.ejs", {
          listTitle: "review.slug",
          review: review,
          user: user,
        });
      } catch (error) {
        console.error("Error retrieving review:", error);
        res
          .status(500)
          .json({ message: "Error retrieving review: " + error.message });
      }
    } else {
      res.redirect("/");
    }
  }

  static async getBookReview(req, res) {
    try {
      const user = req.user || null;
      const { slug } = req.params;
      const ip = req.ip;
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

      await db.query(
        "INSERT INTO recommendations (ip_address, book_review_id) VALUES ($1, $2)",
        [ip, review.id]
      );

      if (req.isAuthenticated() && !user.author) {
        const user = req.user;
        const previous = await db.query(
          "SELECT * FROM reader_views WHERE reader_id = $1 AND review_id = $2",
          [user.id,  review.id]
        );

        if (previous.rows.length === 0) {
          const result = await db.query(
            `INSERT INTO reader_views (reader_id, review_id) 
             VALUES ($1, $2) 
             RETURNING *`,
            [user.id,  review.id]
          );
        } else {
          const updated = await db.query(
            `UPDATE reader_views 
             SET view_count = view_count + 1, 
                 last_viewed_at = CURRENT_TIMESTAMP, 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE reader_id = $1 AND review_id = $2 
             RETURNING *`,
            [user.id,  review.id]
          );
        }
      }

      res.renderWithShowLayout("show.ejs", {
        listTitle: "review.slug",
        review: review,
        user: user,
      });
    } catch (error) {
      console.error("Error retrieving review:", error);
      res
        .status(500)
        .json({ message: "Error retrieving review: " + error.message });
    }
  }

  static async getBooksByTitle(req, res) {
    const { title } = req.query;
    try {
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      // Fetch multiple books with a limit for suggestions
      const searchResponse = await axios.get(
        "https://openlibrary.org/search.json",
        {
          params: {
            title,
            fields:
              "title,cover_i,author_name,first_publish_year,subject,publisher,isbn",
            limit: 10, // Adjust the limit based on your requirements
          },
        }
      );

      const books = searchResponse.data.docs;
      if (!books || books.length === 0) {
        return res.status(404).json({ message: "No books found" });
      }

      // Transform the books into a simplified structure
      const suggestions = books.map((book) => {
        const coverUrl = book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null;
        const author = book.author_name
          ? book.author_name.join(", ")
          : "Unknown";
        const publishYear = book.first_publish_year || "Unknown";
        const genres = book.subject
          ? book.subject.slice(0, 5).join(", ") // Limit genres for brevity
          : "Not available";
        const publishers = book.publisher
          ? book.publisher.slice(0, 3).join(", ") // Limit publishers for brevity
          : "Not available";
        const isbn = book.isbn ? book.isbn[0] : "Not available";

        return {
          title: book.title,
          coverUrl,
          author,
          publishYear,
          genres,
          publishers,
          isbn,
        };
      });

      return res.status(200).json(suggestions);
    } catch (error) {
      console.error("Error fetching books:", error.message);
      return res
        .status(500)
        .json({ message: "Error fetching books: " + error.message });
    }
  }
}

export default ReviewController;
