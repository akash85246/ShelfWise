import express from "express";
const router = express.Router();
import UserController from "../controllers/user.controller.js";

router.get("/", async (req, res) => {
  res.renderWithLayout("users.ejs", {
    title: "Users Page",
  });
});

export default router;