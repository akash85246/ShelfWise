import express from "express";
import multer from "multer";
import AnticipatedController from "../controllers/anticipated.controller.js";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/anticipated/create",
    upload.single("image"),
    AnticipatedController.createAnticipated);

router.get("/anticipated/search", AnticipatedController.getAnticipated);
export default router;
