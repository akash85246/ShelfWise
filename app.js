const express = require("express");
const cors = require("cors");
const pg = require("pg");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const path = require("path");

dotenv.config();

const router = require("./routes/index");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const reviewRouter = require("./routes/review");
const BrowseBookRouter = require("./routes/browseBook.js");

const { initDB, createUser, getUserByEmail } = require("./db/queries");

require("./cron/bookReleaseNotifier");


const app = express();
const port = 3000;


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
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

db.connect()
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.error("Database connection error:", err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Serve Toastify CSS and JS
app.use('/toastify', express.static(path.join(__dirname, './node_modules/toastify-js/src')));

app.use((req, res, next) => {
  res.locals.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

app.use((req, res, next) => {
  res.renderWithLayout = (view, options = {}) => {
    res.render("./layouts/layout.ejs", {
      ...options,
      view,
      styles: options.styles || [],
      scripts: options.scripts || [],
    });
  };
  next();
});

app.use("/", authRouter);
app.use("/api", userRouter);
app.use("/api", reviewRouter);
app.use("/api", BrowseBookRouter);
app.use("/", router);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/home`,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let result = await getUserByEmail(profile.emails[0].value);

        if (result === undefined) {
          const newUser = await createUser({
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0]?.value,
          });

          cb(null, newUser);
        } else {
          cb(null, result);
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

app.listen(port, async () => {
  await initDB();
  console.log(`Server running on port ${port}`);
});


