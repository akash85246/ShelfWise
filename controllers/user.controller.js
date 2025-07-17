const { searchAndFilterUser } = require("../db/queries");

async function getSearchAndFilterUser(req, res) {
  try {
    const { searchTerm, sortBy, page_size = 10, page = 1, user_id } = req.query;
   
    const data = { searchTerm, sortBy, page_size, page, user_id };
    const result = await searchAndFilterUser(data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in searchAndFilterUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getSearchAndFilterUser,
};
