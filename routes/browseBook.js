const express = require("express");
const router = express.Router();

const BrowseBookController = require("../controllers/browseBook.controller");

router.get("/search", BrowseBookController.getSearchAndFilterReviews);

module.exports = router;