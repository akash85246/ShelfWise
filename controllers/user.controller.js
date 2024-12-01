class UserController {
  async addBookReview(req, res) {
    const {
      setting_rating,
      characters_rating,
      style_rating,
      engagement_rating,
      plot_rating,
      notes,
      title,
      author,
      series,
      quote,
      most_surprising_moment,
      favourite_character,
      least_favourite_character,
      ending,
      start_date,
      end_date,
      format,
      genre,
    } = req.body;

    let slug = slugify(title, { lower: true, strict: true });

    const checkSlugQuery = "SELECT COUNT(*) FROM book_reviews WHERE slug = $1";
    const result = await pool.query(checkSlugQuery, [slug]);

    const final_rating= (setting_rating + characters_rating + style_rating + engagement_rating+plot_rating)/4;

    if (result.rows[0].count > 0) {
      let counter = 1;
      let newSlug;
      do {
        newSlug = `${slug}-${counter}`;
        counter++;
        const checkNewSlugQuery =
          "SELECT COUNT(*) FROM book_reviews WHERE slug = $1";
        const newSlugResult = await pool.query(checkNewSlugQuery, [newSlug]);
      } while (newSlugResult.rows[0].count > 0);
      slug = newSlug;
    }

    const query = `
          INSERT INTO book_reviews 
          (setting_rating, characters_rating, style_rating, engagement_rating, notes, title, author, 
          series, quote, most_surprising_moment, favourite_character, least_favourite_character, 
          ending, start_date, end_date, format, genre, slug,plot_rating, final_rating) 
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,$19,$20)
        `;

    const values = [
      setting_rating,
      characters_rating,
      style_rating,
      engagement_rating,
      notes,
      title,
      author,
      series,
      quote,
      most_surprising_moment,
      favourite_character,
      least_favourite_character,
      ending,
      start_date,
      end_date,
      format,
      genre,
      slug,
    ];

    try {
      await pool.query(query, values);
      console.log("Book review added successfully!");
    } catch (error) {
      console.error("Error adding book review:", error);
    }
  }

}

export default UserController;
