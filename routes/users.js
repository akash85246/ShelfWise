const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", (req, res) => {
  res.render("pages/index", { title: "ShelfWise" });
});

router.get("/search-user", UserController. getSearchAndFilterUser);

module.exports = router;
