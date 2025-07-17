const { use } = require("passport");
const pool = require("./connection.js");
const slugModule = require("slug");
const slug = slugModule.default || slugModule;

// Generate a unique slug for any table
function generateUniqueSlugFactory(tableName = "book_reviews") {
  return async function generateUniqueSlug(title) {
    const baseSlug = slug(title, { lower: true });
    let slugField = baseSlug;
    let count = 1;

    while (await slugExists(slugField, tableName)) {
      slugField = `${baseSlug}-${count++}`;
    }

    return slugField;
  };
}

// Check if slug exists in table
async function slugExists(slug, tableName) {
  const query = `SELECT 1 FROM ${tableName} WHERE slug = $1`;
  const { rows } = await pool.query(query, [slug]);
  return rows.length > 0;
}

// Create update_updated_at_column function
async function createUpdateTimestampFunction() {
  const query = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
  await pool.query(query);
  console.log("update_updated_at_column function created");
}

// Create book_reviews table
async function createBookReviewsTable() {
  const reviewQuery = `
    CREATE TABLE IF NOT EXISTS public.book_reviews (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES authorized_users(id) ON DELETE SET NULL,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) NOT NULL UNIQUE,
      status VARCHAR(50) DEFAULT 'published',
      author VARCHAR(255),
      review TEXT,
      quote TEXT,
      moment TEXT,
      favorite_character VARCHAR(255),
      least_favorite_character VARCHAR(255),
      ending TEXT,
      genre VARCHAR(250),
      format VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      views INT DEFAULT 0,
      moment_page_number INT CHECK (moment_page_number >= 0),
      cover_url TEXT,
      isbn VARCHAR(21),
      publisher TEXT,
      published_year INT
    );
  `;

  const ratingQuery = `
    CREATE TABLE IF NOT EXISTS public.book_review_ratings (
      id SERIAL PRIMARY KEY,
      review_id INTEGER REFERENCES public.book_reviews(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      rating INT CHECK (rating >= 0 AND rating <= 5) NOT NULL
    );
  `;

  await pool.query(reviewQuery);
  await pool.query(ratingQuery);
  console.log("book_reviews & book_review_ratings tables created");
}

async function createBookDraft(data) {
   const {
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
  } = data;

  try {
    const client = await pool.connect();
    const generateSlug = generateUniqueSlugFactory("book_reviews");
    const slugField = await generateSlug(title);

    try {
      await client.query("BEGIN");

      const insertReviewQuery = `
        INSERT INTO book_reviews (
          user_id, title, author, review, quote, moment, moment_page_number,
          favorite_character, least_favorite_character, ending,
          genre, format, cover_url, isbn, publisher, published_year, slug ,status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, $18)
        RETURNING id;
      `;

      const reviewValues = [
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
        slugField,
        'draft'
      ];

      const res = await client.query(insertReviewQuery, reviewValues);
      const reviewId = res.rows[0].id;

      const insertRatingQuery = `
        INSERT INTO book_review_ratings (review_id, title, rating)
        VALUES ($1, $2, $3)
      `;

      for (const rating of ratings) {
        await client.query(insertRatingQuery, [
          reviewId,
          rating.title,
          rating.value,
        ]);
      }

      await client.query("COMMIT");
      console.log("Review and ratings inserted");
      return slugField;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error inserting review and ratings:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("DB Connection Error:", err);
    throw err;
  }
}

// Create review with ratings
async function createBookReview(data) {
  const {
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
  } = data;

  try {
    const client = await pool.connect();
    const generateSlug = generateUniqueSlugFactory("book_reviews");
    const slugField = await generateSlug(title);

    try {
      await client.query("BEGIN");

      const insertReviewQuery = `
        INSERT INTO book_reviews (
          user_id, title, author, review, quote, moment, moment_page_number,
          favorite_character, least_favorite_character, ending,
          genre, format, cover_url, isbn, publisher, published_year, slug
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING id;
      `;

      const reviewValues = [
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
        slugField,
      ];

      const res = await client.query(insertReviewQuery, reviewValues);
      const reviewId = res.rows[0].id;

      const insertRatingQuery = `
        INSERT INTO book_review_ratings (review_id, title, rating)
        VALUES ($1, $2, $3)
      `;

      for (const rating of ratings) {
        await client.query(insertRatingQuery, [
          reviewId,
          rating.title,
          rating.value,
        ]);
      }

      await client.query("COMMIT");
      console.log("Review and ratings inserted");
      return slugField;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error inserting review and ratings:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("DB Connection Error:", err);
    throw err;
  }
}

async function toggleReviewStatus(data) {
  const {userId, reviewId, status} = data;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const review = await getReviewById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    
    if (review.user_id != userId) {
      throw new Error("Unauthorized: You can only update your own reviews");
    }
    if (status !== "published" && status !== "draft") {
      throw new Error("Invalid status: Must be 'published' or 'draft'");
    }
    const query = `
      UPDATE book_reviews
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, reviewId];
    const res = await client.query(query, values);
    await client.query("COMMIT");
    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error toggling review status:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function updateBookReview(data) {
  const {
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
    review_id,
  } = data;

  const client = await pool.connect();

  let slugField;

  try {
    const previousReview = await getReviewById(review_id);

    if (!previousReview) {
      throw new Error("Review not found");
    }
    await client.query("BEGIN");

    if (previousReview.title !== title) {
      const generateSlug = generateUniqueSlugFactory("book_reviews");
      slugField = await generateSlug(title);
    } else {
      slugField = previousReview.slug;
    }

    const updateReviewQuery = `
      UPDATE book_reviews
      SET user_id = $1, title = $2, author = $3, review = $4, quote = $5,
          moment = $6, moment_page_number = $7, favorite_character = $8,
          least_favorite_character = $9, ending = $10, genre = $11,
          format = $12, cover_url = $13, isbn = $14, publisher = $15,
          published_year = $16, slug = $17
      WHERE id = $18
      RETURNING slug;
    `;

    const reviewValues = [
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
      slugField,
      review_id,
    ];

    const res = await client.query(updateReviewQuery, reviewValues);

    const newSlug = res.rows[0].slug;

    // Delete existing ratings
    await client.query("DELETE FROM book_review_ratings WHERE review_id = $1", [
      review_id,
    ]);

    // Insert new ratings
    const insertRatingQuery = `
      INSERT INTO book_review_ratings (review_id, title, rating)
      VALUES ($1, $2, $3)
    `;

    for (const rating of ratings) {
      await client.query(insertRatingQuery, [
        review_id,
        rating.title,
        rating.value,
      ]);
    }

    await client.query("COMMIT");

    return { slug: newSlug };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating review:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function searchAndFilterReviews(data) {
  const {
    searchTerm = "",
    genre = "",
    format = "",
    published_year = "",
    sortBy = "created_at DESC",
    status = "",
    page_size = 10,
    page = 1,
    author_id = null,
    user_id = null,
  } = data;

  const offset = (page - 1) * page_size;
  const values = [];
  let index = 1;

  let query = `
    SELECT br.*, au.full_name AS reviewer_name
    FROM book_reviews br
    LEFT JOIN authorized_users au ON br.user_id = au.id
    WHERE 1=1
  `;

  if (author_id) {
    query += ` AND br.user_id = $${index}`;
    values.push(author_id);
    index++;
  }

  if (searchTerm) {
    query += `
      AND (
        LOWER(br.title) LIKE LOWER($${index}) OR
        LOWER(br.author) LIKE LOWER($${index}) OR
        LOWER(br.isbn) LIKE LOWER($${index}) OR
        LOWER(au.full_name) LIKE LOWER($${index})
      )
    `;
    values.push(`%${searchTerm}%`);
    index++;
  }

  if (genre) {
    query += ` AND br.genre = $${index}`;
    values.push(genre);
    index++;
  }

  if (format) {
    query += ` AND br.format = $${index}`;
    values.push(format);
    index++;
  }

  if (published_year) {
    query += ` AND br.published_year = $${index}`;
    values.push(published_year);
    index++;
  }

  if (status) {
    query += ` AND br.status = $${index}`;
    values.push(status);
    index++;
  }

  // Validate and apply sorting
  const allowedSorts = ["created_at", "updated_at", "views", "published_year"];
  let safeSort = "created_at DESC";

  if (sortBy) {
    const parts = sortBy.trim().split(" ");
    const column = parts[0];
    const direction = (parts[1] || "DESC").toUpperCase();

    if (allowedSorts.includes(column) && ["ASC", "DESC"].includes(direction)) {
      safeSort = `${column} ${direction}`;
    }
  }

  query += ` ORDER BY ${safeSort} LIMIT $${index} OFFSET $${index + 1}`;
  values.push(page_size, offset);

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return [];
  }
  let filteredRows = rows;

  if (user_id) {
    filteredRows = rows.filter((book) => {
      if (book.status == "draft") {
        return book.user_id == user_id;
      }
      return true;
    });
  } else {
    filteredRows = rows.filter((book) => book.status === "published");
  }

  return filteredRows;
}


async function getHomePageReviewsAndReviewer() {
  const top_six_Reviews = searchAndFilterReviews({
    sortBy: "views DESC",
    page_size: 6,
    page: 1,
  });
  const top_six_Reviewer = searchAndFilterUser({
    sortBy: "most_reviewed",
    page_size: 6,
    page: 1,
  });
  const [topReviews, topReviewers] = await Promise.all([
    top_six_Reviews,
    top_six_Reviewer,
  ]);

  console.log("Top Reviews:", topReviews);
  console.log("Top Reviewers:", topReviewers);
  return {
    topReviews: topReviews || [],
    topReviewers: topReviewers || [],
  };
}

// Create reader_views table
async function createReaderViewsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS reader_views (
      id SERIAL PRIMARY KEY,
      reader_id INT NOT NULL,
      review_id INT NOT NULL REFERENCES book_reviews(id) ON DELETE CASCADE,
      view_count INT DEFAULT 1,
      first_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(reader_id, review_id)
    );
  `;

  try {
    await pool.query(query);
    console.log("reader_views table created.");
  } catch (error) {
    console.error("Error creating reader_views table:", error);
  }
}

async function updateViewReview(data) {
  const { review_id, reader_id } = data;

  try {
    const query = `
      INSERT INTO reader_views (reader_id, review_id)
      VALUES ($1, $2)
      ON CONFLICT (reader_id, review_id) DO UPDATE
      SET view_count = reader_views.view_count + 1,
          last_viewed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [reader_id, review_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating view count:", error);
    throw error;
  }
}

const getUserStats = async (userId) => {
  try {
    const queries = {
      mostReviewed: `
       SELECT genre_trimmed AS genre, COUNT(*) AS count
        FROM (
          SELECT unnest(string_to_array(genre, ',')) AS genre_trimmed
          FROM book_reviews
          WHERE user_id = $1 AND genre IS NOT NULL
        ) AS genre_list
      GROUP BY genre_trimmed
    ORDER BY count DESC
    LIMIT 1;
      `,
      recentReview: `
        SELECT created_at
        FROM book_reviews
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
      `,
      mostViewedBlog: `
        SELECT br.title,br.author,br.user_id,br.cover_url, br.slug, COALESCE(SUM(rv.view_count), 0) AS total_views
        FROM book_reviews br
        LEFT JOIN reader_views rv ON br.id = rv.review_id
        WHERE br.user_id = $1
        GROUP BY br.id
        ORDER BY total_views DESC
        LIMIT 1;
      `,
      totalReviews: `
        SELECT COUNT(*) AS total_reviews
        FROM book_reviews
        WHERE user_id = $1;
      `,
      avgRatingGiven: `
        SELECT ROUND(AVG(brr.rating), 2) AS avg_given_rating
        FROM book_review_ratings brr
        JOIN book_reviews br ON br.id = brr.review_id
        WHERE br.user_id = $1;
      `,
    };

    const [
      { rows: mostReviewedGenre },
      { rows: recentReview },
      { rows: mostViewedBlog },
      { rows: totalReviews },
      { rows: avgRatingGiven },
    ] = await Promise.all([
      pool.query(queries.mostReviewed, [userId]),
      pool.query(queries.recentReview, [userId]),
      pool.query(queries.mostViewedBlog, [userId]),
      pool.query(queries.totalReviews, [userId]),
      pool.query(queries.avgRatingGiven, [userId]),
    ]);

    return {
      mostReviewedGenre: mostReviewedGenre[0]?.genre || "N/A",
      recentReviewDate:
        recentReview[0]?.created_at?.toISOString().split("T")[0] || "N/A",
      mostViewedBlog: mostViewedBlog[0] || "N/A",
      totalReviews: totalReviews[0]?.total_reviews || 0,
      avgRatingGiven: avgRatingGiven[0]?.avg_given_rating || "N/A",
    };
  } catch (err) {
    console.error("Error in getUserStats:", err);
    throw err;
  }
};

async function getReviewBySlug({ slug }) {
  const query = `
    SELECT * FROM book_reviews
    WHERE slug = $1;
  `;
  slug = slug.trim();

  const result = await pool.query(query, [slug]);

  return result.rows[0];
}

async function getReviewById(id) {
  const query = `
    SELECT * FROM book_reviews
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function getBookRatingsByReviewId(reviewId) {
  if (!reviewId) {
    throw new Error("Review ID is required to fetch ratings");
  }

  const query = `
    SELECT * FROM book_review_ratings
    WHERE review_id = $1;
  `;
  const result = await pool.query(query, [reviewId]);
  return result.rows || [];
}

// Create authorized_users table
async function createAuthorizedUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS authorized_users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(100),
      profile_picture TEXT,
      author BOOLEAN DEFAULT TRUE,
      slug VARCHAR(255) UNIQUE,
      quote TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("authorized_users table created");
}

// Create new user
async function createUser(user) {
  const { google_id, email, name, photo } = user;
  const generateSlug = generateUniqueSlugFactory("authorized_users");
  const slugField = await generateSlug(name);

  try {
    const query = `
      INSERT INTO authorized_users (google_id, email, full_name, profile_picture, slug)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (google_id) DO UPDATE
      SET email = EXCLUDED.email,
          full_name = EXCLUDED.full_name,
          profile_picture = EXCLUDED.profile_picture,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [google_id, email, name, photo, slugField];
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function searchAndFilterUser(data) {
  const { searchTerm = '', sortBy = 'most_reviewed', page_size = 10, page = 1, user_id } = data;
  const values = [];
  let whereClause = '';
  let orderClause = '';
  let selectClause = `
    au.id,
    au.full_name,
    au.profile_picture,
    au.slug,
    au.quote,
    COUNT(DISTINCT br.id) AS total_reviews,
    COALESCE(AVG(urr.rating), 0) AS avg_user_rating,
    COALESCE(SUM(br.views), 0) AS total_views
  `;

  console.log(data);
  if (searchTerm) {
    values.push(`%${searchTerm.toLowerCase()}%`);
    whereClause = `WHERE LOWER(au.full_name) LIKE $${values.length}`;
  }

  switch (sortBy) {
    case 'highest_rated':
      orderClause = 'ORDER BY avg_user_rating DESC NULLS LAST';
      break;
    case 'most_viewed':
      orderClause = 'ORDER BY total_views DESC NULLS LAST';
      break;
    default:
      orderClause = 'ORDER BY total_reviews DESC NULLS LAST';
      break;
  }

  const offset = (page - 1) * page_size;
  values.push(page_size);
  const limitIndex = values.length;
  values.push(offset);
  const offsetIndex = values.length;

  const query = `
    SELECT ${selectClause}
    FROM authorized_users au
    LEFT JOIN book_reviews br ON br.user_id = au.id
    LEFT JOIN user_ratings urr ON urr.rated_user_id = au.id
    ${whereClause}
    GROUP BY au.id
    ${orderClause}
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return [];
    }
    return result.rows;
  } catch (err) {
    console.error('Error searching and filtering users:', err);
    throw err;
  }
}

async function topThreeUsers() {
  const most_viewed_user =searchAndFilterUser({
    sortBy: 'most_viewed',
    page_size: 1,
    page: 1,
  });
  const highest_rated_user = searchAndFilterUser({
    sortBy: 'highest_rated',
    page_size: 1,
    page: 1,
  });
  const most_reviewed_user = searchAndFilterUser({
    sortBy: 'most_reviewed',
    page_size: 1,
    page: 1,
  });
  const [mostViewed, highestRated, mostReviewed] = await Promise.all([
    most_viewed_user,
    highest_rated_user,
    most_reviewed_user,
  ]);
  return {
    most_viewed_user: mostViewed[0] || null,
    highest_rated_user: highestRated[0] || null,
    most_reviewed_user: mostReviewed[0] || null,
  };
  
}

// Fetch user by email
async function getUserByEmail(email) {
  try {
    const query = "SELECT * FROM authorized_users WHERE email = $1";
    const res = await pool.query(query, [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const query = "SELECT * FROM authorized_users WHERE id = $1";
    const res = await pool.query(query, [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

// Create to_be_read table
async function createToBeReadTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS to_be_read (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("to_be_read table created");
}

// Create recommendations table
async function createRecommendationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS recommendations (
      id SERIAL PRIMARY KEY,
      ip_address INET NOT NULL,
      book_review_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_book_review FOREIGN KEY (book_review_id) 
        REFERENCES book_reviews (id) ON DELETE CASCADE
    );
  `;
  await pool.query(query);
  console.log("recommendations table created");
}

// Create anticipated_books table
async function createAnticipatedBooksTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS anticipated_books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      author VARCHAR(255) NOT NULL,
      release_date DATE NOT NULL,
      cdn_link TEXT NOT NULL,
      emoji VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("anticipated_books table created");
}

// Create trigger on anticipated_books
async function createAnticipatedBooksTrigger() {
  const triggerSQL = `
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON anticipated_books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `;
  await createTriggerIfNotExists(
    "set_updated_at",
    "anticipated_books",
    triggerSQL
  );
}

// Create trigger on book_reviews
async function createBookReviewsTrigger() {
  const triggerSQL = `
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.book_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  `;
  await createTriggerIfNotExists("set_updated_at", "book_reviews", triggerSQL);
}

// Check and create trigger only if it doesn’t exist
async function createTriggerIfNotExists(triggerName, tableName, triggerSQL) {
  const checkQuery = `
    SELECT 1 FROM pg_trigger
    WHERE tgname = $1 AND tgrelid = $2::regclass
  `;
  const result = await pool.query(checkQuery, [triggerName, tableName]);

  if (result.rowCount === 0) {
    await pool.query(triggerSQL);
    console.log(`Trigger "${triggerName}" created on "${tableName}"`);
  } else {
    console.log(`ℹ️ Trigger "${triggerName}" already exists on "${tableName}"`);
  }
}

async function createUserRatingsTable() {
  const query = `
   CREATE TABLE IF NOT EXISTS public.user_ratings (
    id SERIAL PRIMARY KEY,
    rated_user_id INT REFERENCES authorized_users(id) ON DELETE CASCADE,
    rated_by_user_id INT REFERENCES authorized_users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;
  await pool.query(query);
  console.log("user_ratings table created");
}

async function createProfileViewsTable() {
  const query = `CREATE TABLE IF NOT EXISTS public.user_profile_views (
  id SERIAL PRIMARY KEY,
  viewer_user_id INT REFERENCES authorized_users(id) ON DELETE CASCADE,
  viewed_user_id INT REFERENCES authorized_users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
  await pool.query(query);
  console.log("user_profile_views table created");
}

// Init all DB tables and triggers
async function initDB() {
  try {
    await createAuthorizedUsersTable();
    await createUpdateTimestampFunction();
    await createBookReviewsTable();
    await createBookReviewsTrigger();
    await createToBeReadTable();
    await createRecommendationsTable();
    await createAnticipatedBooksTable();
    await createAnticipatedBooksTrigger();
    await createReaderViewsTable();
    await createUserRatingsTable();
    await createProfileViewsTable();
    console.log("All tables and triggers initialized");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}

module.exports = {
  initDB,
  createUser,
  getUserByEmail,
  createBookReview,
  getReviewBySlug,
  getBookRatingsByReviewId,
  getUserById,
  updateBookReview,
  updateViewReview,
  searchAndFilterReviews,
  searchAndFilterUser,
  toggleReviewStatus,
  getUserStats,
  topThreeUsers,
  getHomePageReviewsAndReviewer,
  createBookDraft
};
