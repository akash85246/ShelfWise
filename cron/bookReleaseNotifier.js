// /cron/bookReleaseNotifier.js

import cron from "node-cron";
import { db } from "../app.js";
import axios from "axios";

// Function to send email notification to users
const sendReleaseEmails = async (book) => {
  const users = await db.query(`SELECT * FROM public.readers ORDER BY id ASC`);

  for (let user of users) {
    const message = `
            Hi ${user.full_name},
            
            The book "${book.title}" by ${book.author} has been released! 🎉
            
            Cheers,
            SHELFWISE
        `;

    try {
      axios
        .post(`${process.env.BASE_URL}/api/send-email`, {
          username: user.full_name,
          useremail: user.email,
          text: message,
          subject: "New Book Released: " + book.title,
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));

      db.query(`DELETE FROM public.anticipated_books WHERE id = $1`, [book.id]);

      console.log(`Email sent to ${user.email}`);
    } catch (error) {
      console.error("Failed to send email to", user.email, error);
    }
  }
};

// Cron job to run daily at midnight and check for books to notify
cron.schedule("* * * * *", async () => {
  console.log("Checking for book releases...");
  const releasedBooks = await db.query(
    `SELECT * FROM public.anticipated_books ORDER BY id ASC `
  );
  for (let book of releasedBooks) {
    await sendReleaseEmails(book);
  }
});
