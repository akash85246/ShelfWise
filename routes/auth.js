const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.get("/auth/google", AuthController.signInWithGoogle);

router.get("/auth/google/home", AuthController.googleCallback);

router.get("/logout", AuthController.logout);

module.exports = router;