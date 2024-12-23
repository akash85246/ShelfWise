import express from "express";
const router = express.Router();
import AuthController from "../controllers/auth.controller.js";

router.get("/auth/google", AuthController.signInWithGoogle);

// Route to handle Google callback
router.get("/auth/google/home", AuthController.googleCallback);

// Route to log out
router.get("/logout", AuthController.logout);

export default router;