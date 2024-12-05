import express from "express";
const router = express.Router();
import ToBeReadController from "../controllers/toBeRead.controller.js";

router.post("/create", ToBeReadController.createToBeRead);
router.delete("/delete/:id", ToBeReadController.deleteToBeRead);

export default router;