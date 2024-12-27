import nodemailer from "nodemailer";
import Mailgen from "mailgen";

class Mail {
  static async SendEmail(req, res) {
    try {
      // Email configuration for Gmail
      const nodeConfig = {
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      };

      const transporter = nodemailer.createTransport(nodeConfig);
      
      const mailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "SHELFWISE",
          link: "https://shelfwise.com/",
        },
      });
      const { username, useremail, text, subject } = req.body;

      const email = {
        body: {
          name: username,
          intro: text,
          outro: "Need help? Reply to this email.",
        },
      };

      const emailBody = mailGenerator.generate(email);

      const mailOptions = {
        from: process.env.EMAIL,
        to: useremail,
        subject,
        html: emailBody,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).send({ message: "Email sent successfully" });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }
}

export default Mail;
