import express from "express";
const router = express.Router();
import StreakController from "../controllers/streak.controller.js";

router.get("/", async (req, res) => {
  res.renderWithLayout("users.ejs", {
    title: "Users Page",
  });
});

export default router;