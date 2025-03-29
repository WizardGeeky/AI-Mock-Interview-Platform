import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import Interview from "@/app/models/Interview";

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

    // Fetch all interviews matching the encrypted email
    const interviews = await Interview.find({ email: email });

    if (interviews.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Mock interviews are found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, interviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
