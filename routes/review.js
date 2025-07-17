const express = require("express");
const router = express.Router();
const Mail = require("../config/mailer");
const ReviewController = require("../controllers/review.controller");


// Create a new book review
router.post("/create-review", ReviewController.createReview);

// Create a draft book review
router.post("/draft-review", ReviewController.draftReview);

// Update an existing review by its slug
router.patch("/update-review", ReviewController.updateReview);

//update book review status
router.patch("/change-review-status", ReviewController.changeReviewStatus);

// Get book details for a review
router.get("/book-details", ReviewController.getBooksByTitle);



module.exports = router;