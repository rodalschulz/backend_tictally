import nodemailer from "nodemailer";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3600"
    : "https://tictally.io";

const sendVerificationEmail = async (to, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: ${baseURL}/verify-email?token=${token}`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", result);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export default { sendVerificationEmail };
