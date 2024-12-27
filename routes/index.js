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
  // console.log(`Fetching details for title: ${title}`);
  const details = await getBookDetails(title);
  if (details) {
    cache.set(title, details);
  }
  return details;
}

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const recommendedBooks = await db.query(
      "SELECT * FROM book_reviews WHERE views >= 0 AND final_rating >= 3 ORDER BY views DESC, final_rating DESC LIMIT 8;"
    );
    const popularBooks = await db.query(
      "SELECT * FROM book_reviews ORDER BY views DESC, created_at DESC LIMIT 8"
    );
    const recentBooks = await db.query(
      "SELECT * FROM book_reviews ORDER BY created_at DESC LIMIT 8"
    );
    let likedBooks;
    if (user) {
      likedBooks = await db.query(
        `SELECT 
            book_reviews.*, 
            reader_views.view_count, 
            reader_views.last_viewed_at 
         FROM 
            reader_views 
         JOIN 
            book_reviews 
         ON 
            reader_views.review_id = book_reviews.id 
         WHERE 
            reader_views.reader_id = $1 
         ORDER BY 
            reader_views.view_count DESC, 
            reader_views.created_at DESC 
         LIMIT 8`,
        [user.id]
      );
    } else {
      likedBooks = await db.query(
        "SELECT book_reviews.*, reader_views.view_count, reader_views.last_viewed_at FROM reader_views JOIN book_reviews ON reader_views.review_id = book_reviews.id ORDER BY reader_views.view_count DESC, reader_views.created_at DESC LIMIT 8;"
      );
    }

    res.renderWithLayout("index.ejs", {
      listTitle: "Shelfwise",
      recommendedBooks: recommendedBooks.rows,
      popularBooks: popularBooks.rows,
      recentBooks: recentBooks.rows,
      likedBooks: likedBooks.rows,
      user: user || null,
    });
  } catch (error) {
    console.error("Error getting index page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/new-review", async (req, res) => {
  const user = req.user;
  if (req.isAuthenticated() && user.author == true) {
    try {
      res.renderWithNewLayout("new.ejs", {
        listTitle: "Shelfwise",
        user: user,
      });
    } catch (error) {
      console.error("Error getting new review page:", error);
    }
  } else {
    res.redirect("/");
  }
});

router.get("/review/:slug", ReviewController.getBookReview);
router.get("/edit/:slug", ReviewController.getEditBookReview);

router.get("/anticipated", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  const user = req.user;
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum <= 0 || isNaN(limitNum) || limitNum <= 0) {
    return res.status(400).send("Invalid pagination parameters");
  }

  const offset = (pageNum - 1) * limitNum;

  try {
    // Fetch the anticipated books with pagination applied
    const anticipatedBooksQuery = `
      SELECT * 
      FROM anticipated_books 
      ORDER BY release_date ASC
      LIMIT $1 OFFSET $2
    `;
    const anticipatedBooks = await db.query(anticipatedBooksQuery, [
      limitNum,
      offset,
    ]);

    // Fetch the total count of books
    const totalBooksQuery = `
      SELECT COUNT(*) AS count 
      FROM anticipated_books
    `;
    const totalBooksResult = await db.query(totalBooksQuery);
    const totalBooks = parseInt(totalBooksResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalBooks / limitNum);

    // Render the view with paginated data
    res.renderWithAnticipatedLayout("anticipated.ejs", {
      listTitle: "Shelfwise",
      anticipatedBooks: anticipatedBooks.rows,
      user,
      currentPage: pageNum,
      totalPages,
      totalBooks,
    });
  } catch (error) {
    console.error("Error getting anticipated page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/read-later", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;
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
        user: user,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/");
  }
});

router.get("/streak", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;
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
        user: user,
      });
    } catch (error) {
      console.error("Error fetching streaks:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/");
  }
});

router.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;
      let viewHistory;
      if (!user) {
        return res.status(401).send("Unauthorized access"); // Handle unauthorized access
      }
      if(user.author == true){
        viewHistory=await db.query("SELECT * FROM book_reviews ORDER BY created_at DESC;");
      }else{
      viewHistory = await db.query(
        `
          SELECT 
              rv.id AS reader_view_id,
              rv.reader_id,
              rv.review_id,
              rv.view_count,
              rv.last_viewed_at,
              rv.created_at AS reader_view_created_at,
              rv.updated_at AS reader_view_updated_at,
              br.id AS book_review_id,
              br.title,
              br.slug,
              br.author,
              br.genre,
              br.final_rating,
              br.views AS total_views,
              br.cover_url
          FROM 
              reader_views rv
          JOIN 
              book_reviews br
          ON 
              rv.review_id = br.id
          WHERE 
              rv.reader_id = $1
          ORDER BY 
              rv.last_viewed_at DESC;
          `,
        [user.id]
      );}
      res.renderWithProfileLayout("profile.ejs", {
        title: "Users Page",
        user: user,
        viewHistory: viewHistory.rows,
      });
    } catch (err) {
      console.error("Error fetching view history:", err);
      res.status(500).send("An error occurred while fetching the user data.");
    }
  } else {
    res.redirect("/");
  }
});

export default router;
