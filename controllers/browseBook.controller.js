const {
  searchAndFilterReviews,
  getReviewBySlug,
  getBookRatingsByReviewId,
  getUserById,
  updateBookReview,
  updateViewReview,
} = require("../db/queries");

async function getSearchAndFilterReviews(req, res) {
  try {
    const {
      search = "",
      genre = "",
      format = "",
      published_year = "",
      sortBy = "created_at DESC",
      page_size = 10,
      page = 1,
      status_book = "",
      user_id=null,
      author_id=null,
    } = req.query;

  
    const data = {
      searchTerm:search,
      genre,
      format,
      published_year,
      sortBy,
      page_size: parseInt(page_size, 10),
      page: parseInt(page, 10),
      status:status_book,
      ...(author_id && { author_id }),
      ...(user_id && { user_id }),
   
    };

   
    const reviews = await searchAndFilterReviews(data);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getSearchAndFilterReviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getSearchAndFilterReviews,
};
