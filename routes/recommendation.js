import express from "express";
const router = express.Router();
import RecommendationController from "../controllers/recommendation.controller.js";

router.get("/", async (req, res) => {
  res.renderWithLayout("users.ejs", {
    title: "Users Page",
  });
});

export default router;