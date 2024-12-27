import { db } from "../app.js";
class UserController {
  static async deleteUser(req, res) {
    try {
      const user = req.user;
      if (user.author == true) {
        await db.query("DELETE FROM authorized_users WHERE id = $1", [user.id]);
      } else {
        await db.query("DELETE FROM readers  WHERE id = $1", [user.id]);
        await db.query("DELETE FROM reader_views WHERE reader_id = $1", [user.id]);
      }
      req.logout(function (err) {
        if (err) {
          res.status(500).json({ message: err });
        }
        res.json({ message: "Delete a user" });
      });
     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
