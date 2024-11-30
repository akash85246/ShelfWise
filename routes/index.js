import express from "express";

import ReviewController from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.renderWithLayout("index.ejs", {
    listTitle: "Shelfwise",
  });
});

router.get("/new-review", async (req, res) => {
  res.renderWithLayout("new.ejs", {
    listTitle: "Shelfwise",
  });
});

router.get("/review/:slug", ReviewController.getBookReview);
router.get("/edit/:slug", ReviewController.getEditBookReview);


export default router;
