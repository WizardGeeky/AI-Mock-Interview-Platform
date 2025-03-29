import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import User from "@/app/models/UserModel";
import { encryptData, decryptData } from "@/app/utils/cipher";
import { generateResetLink } from "@/app/utils/resetlink";
import { sendPasswordResetLink } from "@/app/config/email-config";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: encryptData(email) });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "No user details found" },
        { status: 200 }
      );
    }

    const resetLink = await generateResetLink(existingUser.email);
    await sendPasswordResetLink(decryptData(existingUser.email), resetLink);
    return NextResponse.json(
      {
        success: true,
        message: "Reset password link sent to your registered email address.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
