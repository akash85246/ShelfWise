import express from "express";
const router = express.Router();
import UserController from "../controllers/user.controller.js";

router.delete("/delete", UserController.deleteUser);

export default router;
