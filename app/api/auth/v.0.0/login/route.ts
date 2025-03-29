import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import User from "@/app/models/UserModel";
import { createToken } from "@/app/utils/token";
import { encryptData } from "@/app/utils/cipher";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 200 }
      );
    }

    const user = await User.findOne({ email: encryptData(email) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 200 }
      );
    }

    if (user.password !== encryptData(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 200 }
      );
    }
    const token = createToken({ email: email });
    return NextResponse.json(
      { success: true, message: "Login successful.", token: token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
