import * as crypto from "crypto";

const secretKey = crypto
  .createHash("sha256")
  .update(process.env.CIPHER_SECRET || "")
  .digest();

if (secretKey.length !== 32) {
  throw new Error("CIPHER_SECRET must be exactly 32 bytes (64 hex characters)");
}

const iv = Buffer.alloc(16, "fixed-initial-ve", "utf-8");

export const encryptData = (plainText: string): string => {
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(plainText, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt the data
export const decryptData = (encryptedText: string): string => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
