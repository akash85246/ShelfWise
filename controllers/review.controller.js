const axios = require("axios");

const {
  createBookReview,
  getReviewBySlug,
  getBookRatingsByReviewId,
  getUserById,
  updateBookReview,
  updateViewReview,
  createBookDraft,
  toggleReviewStatus,
} = require("../db/queries");
async function createReview(req, res) {
  try {
    let {
      user_id,
      title,
      author,
      review,
      quote,
      moment,
      moment_page_number,
      favorite_character,
      least_favorite_character,
      ending,
      genre,
      format,
      cover_url,
      isbn,
      publisher,
      published_year,
      ratings,
    } = req.body;

    const slugField = await createBookReview({
      user_id,
      title,
      author,
      review,
      quote,
      moment,
      moment_page_number,
      favorite_character,
      least_favorite_character,
      ending,
      genre,
      format,
      cover_url,
      isbn,
      publisher,
      published_year,
      ratings,
    });

    res
      .status(201)
      .json({ slug: slugField, message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ message: "Error creating review: " + error.message });
  }
}

async function draftReview(req, res) {
  try {
    let {
      user_id,
      title,
      author,
      review,
      quote,
      moment,
      moment_page_number,
      favorite_character,
      least_favorite_character,
      ending,
      genre,
      format,
      cover_url,
      isbn,
      publisher,
      published_year,
      ratings,
    } = req.body;

    const result = await createBookDraft({
      user_id,
      title,
      author,
      review,
      quote,
      moment,
      moment_page_number,
      favorite_character,
      least_favorite_character,
      ending,
      genre,
      format,
      cover_url,
      isbn,
      publisher,
      published_year,
      ratings,
    });

  
   const  slugField = result.slug;

    res
      .status(201)
      .json({ slug: slugField, message: "Review draft created successfully" });
  } catch (error) {
    console.error("Error creating draft review:", error);
    res
      .status(500)
      .json({ message: "Error creating draft review: " + error.message });
  }
}

async function updateReview(req, res) {
  try {
    let data = req.body;

    const result = await updateBookReview(data);

    if (result === undefined) {
      return res.status(404).json({ message: "Review not found to update" });
    }

    res
      .status(200)
      .json({ slug: result.slug, message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .json({ message: "Error updating review: " + error.message });
  }
}

async function getBookDetails(title) {
  if (!title) {
    return null;
  }
  try {
    const searchResponse = await axios.get(
      "https://openlibrary.org/search.json",
      {
        params: {
          title,
          fields:
            "title,cover_i,author_name,first_publish_year,subject,publisher,isbn",
          limit: 1,
        },
      }
    );

    const book = searchResponse.data.docs[0];
    if (!book) {
      return null;
    }

    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : null;

    const newTitle = book.title;
    const isbn = book.isbn ? book.isbn[0] : "Not available";
    const author = book.author_name ? book.author_name.join(", ") : "Unknown";
    const publishYear = book.first_publish_year || "Unknown";

    let genres = book.subject ? book.subject : [];
    let a = 0;
    let finalGenres = [];
    for (let genre of genres) {
      const genreLength = genre.length + (finalGenres.length > 0 ? 2 : 0);

      if (a + genreLength <= 100) {
        finalGenres.push(genre);
        a += genre.length;
      } else {
        break;
      }
    }
    const genresString =
      finalGenres.length > 0 ? finalGenres.join(", ") : "Not available";
    genres = genresString;

    let publishers = book.publisher ? book.publisher : [];
    let totalLength = 0;
    let finalPublishers = [];
    for (let publisher of publishers) {
      const publisherLength =
        publisher.length + (finalPublishers.length > 0 ? 2 : 0);
      if (totalLength + publisherLength <= 100) {
        finalPublishers.push(publisher);
        totalLength += publisher.length;
      } else {
        break;
      }
    }
    const publishersString =
      finalPublishers.length > 0 ? finalPublishers.join(", ") : "Not available";
    publishers = publishersString.trim();

    return {
      title: newTitle,
      coverUrl,
      author,
      publishYear,
      genres,
      publishers,
      isbn,
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

async function getEditBookReview(req, res) {
  const user = req.user || null;
  if (req.isAuthenticated() && user.author == true) {
    try {
      const { slug } = req.params;
      const review = await getReviewBySlug({ slug });

      if (review === undefined) {
        return res.status(404).json({ message: "Review not found to edit" });
      }

      const ratings = await getBookRatingsByReviewId(review.id);

      if (user.id != review.user_id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this review" });
      }

      res.renderWithLayout("../pages/new.ejs", {
        listTitle: "Shelfwise",
        styles: [
          "/css/header.css",
          "/css/new.css",
          "/css/layout.css",
          "/css/footer.css",
        ],
        scripts: ["/js/edit.js", "/js/header.js"],
        user: user,
        review: review,
        ratings: ratings,
        mode: "edit",
      });
    } catch (error) {
      console.error("Error retrieving review:", error);
      res
        .status(500)
        .json({ message: "Error retrieving review: " + error.message });
    }
  } else {
    res.redirect("/");
  }
}

async function getBookReview(req, res) {
  try {
    const user = req.user || null;
    const { slug } = req.params;
    const review = await getReviewBySlug({ slug });

    if (review === undefined) {
      return res
        .status(404)
        .json({ message: "Review not found to get book review" });
    }

    const bookRatings = await getBookRatingsByReviewId(review.id);
    const reviewAuthor = await getUserById(review.user_id);

    if (user && user.id != review.user_id) {
      data = {
        review_id: review.id,
        reader_id: user.id,
      };
      await updateViewReview(data);
    }

    const shareUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.renderWithLayout("../pages/show.ejs", {
      listTitle: "review.slug",
      styles: [
        "/css/header.css",
        "/css/show.css",
        "/css/layout.css",
        "/css/bookRatingCard.css",
        "/css/shareModal.css",
        "/css/footer.css",
      ],
      scripts: ["/js/shareModal.js", "/js/show.js", "/js/header.js"],
      review: review,
      user: user,
      bookRatings: bookRatings,
      reviewAuthor: reviewAuthor,
      shareUrl: shareUrl,
    });
  } catch (error) {
    console.error("Error retrieving review:", error);
    res
      .status(500)
      .json({ message: "Error retrieving review: " + error.message });
  }
}

async function changeReviewStatus(req, res) {
  try {
    const { userId, reviewId, status } = req.body;

    if (!userId || !reviewId || !status) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const result = await toggleReviewStatus({ userId, reviewId, status });

    if (result === undefined) {
      return res.status(404).json({ message: "Review not found to update" });
    }

    res.status(200).json({
      message: `Review status updated to ${status} successfully`,
      slug: result.slug,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res
      .status(500)
      .json({ message: "Error updating review status: " + error.message });
  }
}

async function getBooksByTitle(req, res) {
  const { title } = req.query;
  try {
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Fetch multiple books with a limit for suggestions
    const searchResponse = await axios.get(
      "https://openlibrary.org/search.json",
      {
        params: {
          title,
          fields:
            "title,cover_i,author_name,first_publish_year,subject,publisher,isbn",
          limit: 10, // Adjust the limit based on your requirements
        },
      }
    );

    const books = searchResponse.data.docs;
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    // Transform the books into a simplified structure
    const suggestions = books.map((book) => {
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null;
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";
      const publishYear = book.first_publish_year || "Unknown";
      const genres = book.subject
        ? book.subject.slice(0, 5).join(", ") // Limit genres for brevity
        : "Not available";
      const publishers = book.publisher
        ? book.publisher.slice(0, 3).join(", ") // Limit publishers for brevity
        : "Not available";
      const isbn = book.isbn ? book.isbn[0] : "Not available";

      return {
        title: book.title,
        coverUrl,
        author,
        publishYear,
        genres,
        publishers,
        isbn,
      };
    });

    return res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching books: " + error.message });
  }
}

module.exports = {
  createReview,
  draftReview,
  updateReview,
  getBookDetails,
  getEditBookReview,
  getBookReview,
  changeReviewStatus,
  getBooksByTitle,
};
