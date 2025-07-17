const passport = require("passport");

  // Trigger Google authentication
  async function signInWithGoogle(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
   
  }

  // Handle callback after Google authentication
  async function googleCallback(req, res, next) {
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })(req, res, next);
  }

  // Log out user and redirect to home
  async function logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }

module.exports = {
  signInWithGoogle,
  googleCallback,
  logout,
};