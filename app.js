import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import router from "./routes/index.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import reviewRouter from "./routes/review.js";
import anticipatedRouter from "./routes/anticipated.js";
import ReadLaterRouter from "./routes/toBeRead.js";
import StreakRouter from "./routes/streak.js";
import RecommendationRouter from "./routes/recommendation.js";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import  "./cron/bookReleaseNotifier.js";
import env from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

env.config();
app.use(cors()); 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.error("Database connection error:", err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.renderWithLayout = (view, options = {}) => {
    res.render("layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithShowLayout = (view, options = {}) => {
    res.render("show.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithEditLayout = (view, options = {}) => {
    res.render("edit.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithNewLayout = (view, options = {}) => {
    res.render("new.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithAnticipatedLayout = (view, options = {}) => {
    res.render("anticipated.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithToBeReadLayout = (view, options = {}) => {
    res.render("toBeRead.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithStreakLayout = (view, options = {}) => {
    res.render("streak.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use((req, res, next) => {
  res.renderWithProfileLayout = (view, options = {}) => {
    res.render("profile.layout.ejs", {
      ...options,
      view: view,
    });
  };
  next();
});

app.use("/", authRouter);
app.use("/api", anticipatedRouter);
app.use("/api", userRouter);
app.use("/api", reviewRouter);
app.use("/api/read-later", ReadLaterRouter);
app.use("/api/streak", StreakRouter);
app.use("/api/recommendation", RecommendationRouter);
app.use("/", router);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/home",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Check in authorized_users table
        let result = await db.query(
          "SELECT * FROM authorized_users WHERE email=$1",
          [profile.emails[0].value]
        );

        if (result.rows.length === 0) {
          // Check in readers table
          result = await db.query("SELECT * FROM readers WHERE email=$1", [
            profile.emails[0].value,
          ]);

          if (result.rows.length === 0) {
            // console.log("New reader:", profile);
            // Create new user in users table
            const newUser = await db.query(
              `INSERT INTO readers (google_id, email,full_name, profile_picture) 
               VALUES ($1, $2, $3, $4) 
               RETURNING *`,
              [
                profile.id,
                profile.emails[0].value,
                profile.displayName,
                profile.photos[0]?.value,
              ]
            );
            // console.log("New user created:", newUser.rows[0]);
            cb(null, newUser.rows[0]);
          } else {
            // Fetch reader
            // console.log("Old reader fetched:", result.rows[0]);
            cb(null, result.rows[0]);
          }
        } else {
          // Fetch authorized user
          if (result.rows[0].google_id == "google-id") {
            const updateUser = await db.query(
              `UPDATE authorized_users
               SET google_id = $1, full_name = $2, profile_picture = $3,
               author = $4
               WHERE email = $5
               RETURNING *`,
              [
                profile.id,
                profile.displayName,
                profile.photos[0]?.value,
                true,
                profile.emails[0].value
              ]
            );
            // console.log("New user created:", updateUser.rows[0]);
            cb(null, updateUser.rows[0]);
          } else {
            // console.log("Old authorized user fetched:", result.rows[0]);
            cb(null, result.rows[0]);
          }
        }
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { db };
