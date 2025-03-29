import crypto from "crypto";
import databaseConnection from "../config/database-config";
import ResetLink from "../models/ResetLink";

export async function generateResetLink(email: string): Promise<string> {
  try {
    await databaseConnection();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3 * 60 * 1000);
    const resetLink = `http://localhost:3000/components/reset/password?resetLink=${resetToken}`;
    await ResetLink.findOneAndDelete({ email });
    await ResetLink.create({ email, link: resetToken, expiry });
    return resetLink;
  } catch (error: any) {
    return error;
  }
}
