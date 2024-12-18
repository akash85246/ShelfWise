import express from "express";
import { db } from "../app.js";
import axios from "axios";
import ReviewController from "../controllers/review.controller.js";

const router = express.Router();

async function getBookDetails(title) {
  if (!title) {
    return null;
  }
  try {
    const searchResponse = await axios.get(
      `https://openlibrary.org/search.json`,
      {
        params: {
          title,
          fields: "cover_i,author_name,first_publish_year,subject,publisher",
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
    const author = book.author_name ? book.author_name.join(", ") : "Unknown";
    const publishYear = book.first_publish_year || "Unknown";
    const genres = book.subject
      ? book.subject.slice(0, 5).join(", ")
      : "Not available";
    const publishers = book.publisher
      ? book.publisher.slice(0, 3).join(", ")
      : "Not available";
    const subjects = book.subject ? book.subject.join(", ") : "Not available";

    return {
      coverUrl,
      author,
      publishYear,
      genres,
      publishers,
      subjects,
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

const cache = new Map();

async function getBookDetailsWithCache(title) {
  if (cache.has(title)) {
    return cache.get(title);
  }

  console.log(`Fetching details for title: ${title}`);
  const details = await getBookDetails(title);

  if (details) {
    cache.set(title, details);
  }

  return details;
}

router.get("/", async (req, res) => {
  try {
    const recommendedBooks = await db.query(
      "SELECT * FROM book_reviews WHERE views >= 0 AND final_rating > 3 ORDER BY views DESC, final_rating DESC LIMIT 6;"
    );
    const popularBooks = await db.query(
      "SELECT * FROM book_reviews ORDER BY views DESC, created_at DESC LIMIT 6"
    );
    const recentBooks = await db.query(
      "SELECT * FROM book_reviews ORDER BY created_at DESC LIMIT 6"
    );
    const likedBooks = await db.query(
      "SELECT * FROM book_reviews WHERE final_rating > 4 ORDER BY final_rating DESC, created_at DESC LIMIT 6"
    );

    res.renderWithLayout("index.ejs", {
      listTitle: "Shelfwise",
      recommendedBooks: recommendedBooks.rows,
      popularBooks: popularBooks.rows,
      recentBooks: recentBooks.rows,
      likedBooks: likedBooks.rows,
    });
  } catch (error) {
    console.error("Error getting index page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/new-review", async (req, res) => {
  try {
    res.renderWithNewLayout("new.ejs", {
      listTitle: "Shelfwise",
    });
  } catch (error) {
    console.error("Error getting new review page:", error);
  }
});

router.get("/review/:slug", ReviewController.getBookReview);
router.get("/edit/:slug", ReviewController.getEditBookReview);

router.get("/anticipated", async (req, res) => {
  try {
    const anticipatedBooks = await db.query(
      "SELECT * FROM anticipated_books ORDER BY release_date ASC"
    );
    res.renderWithAnticipatedLayout("anticipated.ejs", {
      listTitle: "Shelfwise",
      anticipatedBooks: anticipatedBooks.rows,
    });
  } catch (error) {
    console.error("Error getting anticipated page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/read-later", async (req, res) => {
  try {
    
    const seriesBooks = await db.query(
      "SELECT * FROM to_be_read WHERE type = $1 ORDER BY created_at DESC",
      ["series"]
    );

    const standaloneBooks = await db.query(
      "SELECT * FROM to_be_read WHERE type = $1 ORDER BY created_at DESC",
      ["standalone"]
    );

    res.renderWithToBeReadLayout("toBeRead.ejs", {
      seriesBooks: seriesBooks.rows,
      standaloneBooks: standaloneBooks.rows,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/streak", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1).toISOString().split("T")[0]; 
    const endDate = new Date(currentYear, 11, 31).toISOString().split("T")[0]; 
    const query = `
      SELECT 
          TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
          COUNT(*) AS books_read
      FROM 
          book_reviews
      WHERE 
          created_at BETWEEN $1 AND $2
      GROUP BY 
          DATE_TRUNC('month', created_at)
      ORDER BY 
          month;
    `;

    const result = await db.query(query, [startDate, endDate]);
    res.renderWithStreakLayout("streak.ejs", {
      streakData: result.rows, 
    });
  } catch (error) {
    console.error("Error fetching streaks:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
