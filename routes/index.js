const express = require("express");
const axios = require("axios");
const ReviewController = require("../controllers/review.controller");
const {
  getUserStats,
  topThreeUsers,
  getHomePageReviewsAndReviewer,
  getUserByslug,
} = require("../db/queries");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const { topReviews, topReviewers} = await getHomePageReviewsAndReviewer();

    res.renderWithLayout("../pages/index.ejs", {
      listTitle: "Shelfwise",
      styles: [
        "/css/index.css",
        "/css/header.css",
        "/css/layout.css",
        "/css/popularReviewCard.css",
        "/css/footer.css",
        "/css/recentReviewsCard.css",
        "/css/topReviewersCard.css",
        "/css/categoriesCard.css",
      ],
      scripts: ["/js/header.js", "/js/index.js"],
      user: user || null,
      reviewers: topReviewers|| [],
      reviews: topReviews || [],
    });
  } catch (error) {
    console.error("Error getting index page:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/profile/:slug", async (req, res) => {
  try {
    const user = req.user || null;
    const slug = req.params.slug;
    const reviewer = await getUserByslug({slug, userId: user ? user.id : null});
    if (!reviewer) {
      return res.status(404).send("User not found");
    }



    res.renderWithLayout("../pages/profile.ejs", {
      listTitle: "Shelfwise",
      styles: [
        "/css/index.css",
        "/css/header.css",
        "/css/layout.css",
        "/css/footer.css",
        "/css/profileRatingCard.css",
        "/css/profile.css",
      ],
      scripts: ["/js/header.js", "/js/profile.js","/js/profileRatingCard.js"],
      user: user || null,
      reviewer: reviewer || null,
      
    });
  } catch (error) {
    console.error("Error getting index page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/browse-book", async (req, res) => {
  try {
    const user = req.user;
    const genre= req.query.genre || "";

    res.renderWithLayout("../pages/browseBook.ejs", {
      listTitle: "Shelfwise",
      styles: [
        "/css/header.css",
        "/css/browseBook.css",
        "/css/layout.css",
        "/css/footer.css",
      ],
      scripts: ["/js/browseBook.js", "/js/header.js"],
      user: user || null,
      genre: genre,
    });
  } catch (error) {
    console.error("Error getting browse book page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/top-reviewer", async (req, res) => {
  try {
    const user = req.user;
    const topReviewers = await topThreeUsers();

    res.renderWithLayout("../pages/topReviewer.ejs", {
      listTitle: "Shelfwise",
      styles: [
        "/css/header.css",
        "/css/topReviewer.css",
        "/css/layout.css",
        "/css/footer.css",
      ],
      scripts: ["/js/topReviewer.js", "/js/header.js"],
      user: user || null,
      topReviewers: {
        most_viewed: topReviewers.most_viewed_user,
        highest_rated: topReviewers.highest_rated_user,
        most_reviewed: topReviewers.most_reviewed_user,
      },
    });
  } catch (error) {
    console.error("Error getting browse book page:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/create", async (req, res) => {
  const user = req.user;

  if (req.isAuthenticated() && user.author == true) {
    try {
      res.renderWithLayout("../pages/new.ejs", {
        listTitle: "Shelfwise",
        styles: [
          "/css/header.css",
          "/css/new.css",
          "/css/layout.css",
          "/css/footer.css",
        ],
        scripts: ["/js/new.js", "/js/header.js"],
        user: user,
        review: null,
        ratings: null,
        mode: "create",
      });
    } catch (error) {
      console.error("Error getting new review page:", error);
    }
  } else {
    res.redirect("/");
  }
});

router.get("/my-review", async (req, res) => {
  const user = req.user;

  if (req.isAuthenticated() && user.author == true) {
    try {
      const userStats = await getUserStats(user.id);

      res.renderWithLayout("../pages/myReview.ejs", {
        listTitle: "Shelfwise",
        styles: [
          "/css/header.css",
          "/css/myReview.css",
          "/css/layout.css",
          "/css/footer.css",
        ],
        scripts: ["/js/myReview.js", "/js/header.js"],
        user: user,
        userStats: userStats,
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
      if (user.author == true) {
        viewHistory = await db.query(
          "SELECT * FROM book_reviews ORDER BY created_at DESC;"
        );
      } else {
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
        );
      }
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

module.exports = router;
