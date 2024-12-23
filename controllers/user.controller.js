class UserController {
  static async deleteUser(req, res) {
    try {
      const user = req.user;
      if (user.author == true) {
        await db.query("DELETE FROM authorized_users WHERE id = $1", [user.id]);
      } else {
        await db.query("DELETE FROM readers  WHERE id = $1", [user.id]);
      }
      res.json({ message: "Delete a user" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
