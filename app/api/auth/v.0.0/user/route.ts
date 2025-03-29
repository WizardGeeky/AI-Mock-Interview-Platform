import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import User from "@/app/models/UserModel";
import { encryptData } from "@/app/utils/cipher";

// Create user account
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { fullName, email, password } = await request.json();
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ email: encryptData(email) });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }
    await User.create({
      fullName: encryptData(fullName),
      email: encryptData(email),
      password: encryptData(password),
    });
    return NextResponse.json(
      { success: true, message: "User created successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
