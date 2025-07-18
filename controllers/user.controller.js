const { searchAndFilterUser,userBySlug,updateUserProfile,updateUserRating } = require("../db/queries");

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

async function getUserByslug(req, res) {
  try {
    const { slug } = req.params;
    const user = await userBySlug(slug);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by slug:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function patchUpdateUserRating(req, res) {
  try {
    const { rated_user_id, rating } = req.body;
    const user = req.user || {};
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user_id = user.id;


    if( !rated_user_id || !rating || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }
    if(rated_user_id === user_id) {
      return res.status(400).json({ error: "You cannot rate yourself" });
    }

    const updatedRating = await updateUserRating({ rated_user_id, rating, user_id });
    if (!updatedRating) {
      return res.status(404).json({ error: "User not found or rating not updated" });
    }
    res.status(200).json(updatedRating);
  } catch (error) {
    console.error("Error updating user rating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function patchUpdateUserProfile(req, res) {
  try {
    const { userId, fullName, profilePicture, quote } = req.body;
    
    if (!userId && !fullName && !profilePicture && !quote) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const updatedUser = await updateUserProfile({ userId, fullName, profilePicture, quote });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getSearchAndFilterUser,
  getUserByslug,
  patchUpdateUserProfile,
  patchUpdateUserRating,
};
