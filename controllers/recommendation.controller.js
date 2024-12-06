class RecommendationController {
  static async addRecommendation(req, res) {
    try {
      const ip = req.ip;
      console.log("Client IP Address:", ip);
      const { id } = req.params;
      await db.query(
        "INSERT INTO recommendations (ip_address, book_review_id) VALUES ($1, $2)",
        [ip, id]
      );
      res.status(201).json({ message: "Recommendation added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default RecommendationController;
