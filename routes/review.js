import express from "express";
import axios from "axios";
import ReviewController from "../controllers/review.controller.js";

const router = express.Router();

// Get all reviews with optional query parameters (e.g., sort, page, limit)
router.get("/reviews", ReviewController.getReviews);
// Example: GET /reviews?sort=best&page=2&limit=10

// Create a new book review
router.post("/create-review", ReviewController.createReview);
// Example Body (JSON):
// {
//   "title": "The Great Gatsby",
//   "author": "F. Scott Fitzgerald",
//   "setting_rating": 5,
//   "plot_rating": 4,
//   "character_rating": 5,
//   "style_rating": 5,
//   "engagement_rating": 4,
//   "note": "A classic novel",
//   "quote": "In my younger and more vulnerable years...",
//   "moment": "The first party in the novel",
//   "favorite_character": "Nick Carraway",
//   "least_favorite_character": "Tom Buchanan",
//   "ending": "Tragic but fitting",
//   "start_date": "2024-01-01",
//   "end_date": "2024-02-01",
//   "genre": "Fiction",
//   "format": "Hardcover"
// }

// Update an existing review by its slug (slug is a URL-friendly version of the title)
router.patch("/update-review/:slug", ReviewController.updateReview);
// Example: PATCH /update-review/the-great-gatsby
// Example Body (JSON):
// {
//   "title": "The Great Gatsby - Updated",
//   "author": "F. Scott Fitzgerald",
//   "setting_rating": 4,
//   "plot_rating": 5,
//   "character_rating": 5,
//   "style_rating": 4,
//   "engagement_rating": 4,
//   "note": "Updated note"
// }

// Delete a review by its slug
router.delete("/delete-review/:slug", ReviewController.deleteReview);
// Example: DELETE /delete-review/the-great-gatsby

// Filter reviews based on query parameters like sort, genre, or recommendation type
router.get("/review/filter", ReviewController.filterReviews);
// Example: GET /review/filter?sort=best&genre=Fiction&page=1&limit=10&recommended=book

// Search reviews by a query parameter (e.g., title or author)
router.get("/review/search", ReviewController.searchReviews);
// Example: GET /review/search?query=Gatsby
// Example query parameter values could include a book title, author, or keyword

router.get("/book-cover",ReviewController.getBookCoverByTitle);


export default router;
