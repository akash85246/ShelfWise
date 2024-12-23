import passport from "passport";

class AuthController {
  // Trigger Google authentication
  static async signInWithGoogle(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }

  // Handle callback after Google authentication
  static async googleCallback(req, res, next) {
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })(req, res, next);
  }

  // Log out user and redirect to home
  static async logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
}

export default AuthController;