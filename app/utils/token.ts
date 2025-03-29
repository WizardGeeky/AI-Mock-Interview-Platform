import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtPayload {
  email: string;
  exp?: number;
}

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "";
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const createToken = (payload: JwtPayload): string => {
  try {
    return jwt.sign(payload, secretKey, { expiresIn: "3h" });
  } catch (err) {
    throw new Error("Failed to create token: " + err);
  }
};

export const validateToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    if (isTokenExpired(decoded)) {
      throw new Error("Token has expired");
    }

    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (decoded && isTokenExpired(decoded)) {
      return null;
    }
    return decoded;
  } catch (err) {
    return null;
  }
};

export const isTokenExpired = (decoded: JwtPayload): boolean => {
  if (!decoded.exp) {
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTimestamp;
};
