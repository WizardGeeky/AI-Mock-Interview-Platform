import { NextRequest, NextResponse } from "next/server";
import databaseConnection from "@/app/config/database-config";
import Interview from "@/app/models/Interview";
import { reviewCodeSubmission } from "@/app/config/ai-config";
import { decryptData } from "@/app/utils/cipher";

export async function POST(req: NextRequest) {
  try {
    await databaseConnection();
    const { email, jobTitle, question, code, language } = await req.json();
    if (!email || !jobTitle || !question || !language || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const { feedback, score } = await reviewCodeSubmission(
      question,
      language,
      code
    );
    const newInterview = new Interview({
      email,
      jobTitle,
      question,
      code,
      language,
      feedback,
      score,
    });

    const savedInterview = await newInterview.save();
    return NextResponse.json(
      { success: true, interview: savedInterview },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" + error },
      { status: 500 }
    );
  }
}
