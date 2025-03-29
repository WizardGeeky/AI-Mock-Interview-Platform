import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_PERSONAL_EMAIL,
    pass: process.env.NEXT_PUBLIC_BURNER_PASSWORD,
  },
});

export const sendPasswordResetLink = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_PERSONAL_EMAIL,
      to: email,
      subject: "Your Password Reset Link",
      text: `This link is ${otp}. It will expire in 3 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Unable to send reset link email.");
  }
};
