// /cron/bookReleaseNotifier.js

import cron from "node-cron";
import { db } from "../app.js";
import axios from "axios";

// Function to send email notification to users
const sendReleaseEmails = async (book) => {
  const users = await db.query(`SELECT * FROM public.readers ORDER BY id ASC`);

  users.rows.forEach(async (user) => {
    const message = `
    <p>Hi ${user.full_name},</p>
    
    <p>The book "<strong>${book.title}</strong>" by <em>${book.author}</em> has been released! 🎉</p>
    
    <img src="${book.cdn_link}" alt="Book Cover" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; margin-top: 10px;" />
    
    <p>Cheers,</p>
    <p><strong>SHELFWISE</strong></p>
`;

    try {

  const baseUrl = `${req.protocol}://${req.get('host')}`;
      axios
        .post(`${baseUrl}/api/send-email`, {
          username: user.full_name,
          useremail: user.email,
          text: message,
          subject: "New Book Released: " + book.title,
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));

      db.query(`DELETE FROM public.anticipated_books WHERE id = $1`, [book.id]);

      db.query(
        `INSERT INTO to_be_read (title, author,type) VALUES ($1, $2, $3)`,
        [book.title, book.author, "standalone"]
      );

      console.log(`Email sent to ${user.email}`);
    } catch (error) {
      console.error("Failed to send email to", user.email, error);
    }
  });
};

// Cron job to run daily at midnight and check for books to notify
cron.schedule("* * * * *", async () => {
  console.log("Checking for book releases...");
  const releasedBooks = await db.query(
    `SELECT * FROM public.anticipated_books WHERE release_date <= CURRENT_DATE ORDER BY id ASC;`
  );
  //console.log(releasedBooks.rows);
  releasedBooks.rows.forEach(async (book) => {
    await sendReleaseEmails(book);
  });
});
