import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import ResetLink from "@/app/models/ResetLink";
import User from "@/app/models/UserModel";
import { decryptData, encryptData } from "@/app/utils/cipher";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await databaseConnection();
    const { resetToken, newPassword } = await request.json();
    if (!resetToken || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token and new password are required.",
        },
        { status: 400 }
      );
    }

    const resetRecord = await ResetLink.findOne({ link: resetToken });
    if (!resetRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    if (new Date(resetRecord.expiry) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Reset token has expired." },
        { status: 400 }
      );
    }

    const decryptedEmail = decryptData(resetRecord.email);
    const existingUser = await User.findOne({
      email: encryptData(decryptedEmail),
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Invalid access! Please try again." },
        { status: 400 }
      );
    }

    existingUser.password = encryptData(newPassword);
    await existingUser.save();
    await ResetLink.deleteOne({ link: resetToken });
    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully. You can now log in with your new password.",
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
