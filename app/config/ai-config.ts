import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
});

interface InterviewQuestionResponse {
  question: string;
  difficulty: string;
  explanation: string;
}

interface CodeReviewResponse {
  feedback: string;
  score: number;
}

export async function generateInterviewQuestion(
  jobTitle: string
): Promise<InterviewQuestionResponse> {
  if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim() === "") {
    throw new Error("Invalid job title. Please provide a valid job title.");
  }

  try {
    const prompt = `Generate a short LeetCode-style coding problem for a ${jobTitle}. 
    Keep it simple and direct. Provide only:
    - Problem Statement
    - 1 Example Input & Output
    - Constraints (if necessary).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.text?.trim();
    if (!text) throw new Error("Failed to generate question.");

    return {
      question: text,
      difficulty: "Easy",
      explanation: "This is a short coding problem to assess basic problem-solving skills.",
    };
  } catch (error) {
    console.error("Error generating interview question:", error);
    throw new Error("Unable to generate an interview question at this time.");
  }
}

export async function reviewCodeSubmission(
  question: string,
  language: string,
  userCode: string
): Promise<CodeReviewResponse> {
  if (
    !question || typeof question !== "string" || question.trim() === "" ||
    !language || typeof language !== "string" || language.trim() === "" ||
    !userCode || typeof userCode !== "string" || userCode.trim() === ""
  ) {
    throw new Error("Invalid input. Ensure that question, language, and user code are all provided.");
  }

  try {
    const prompt = `You are an AI code reviewer.
    - Review the following ${language} code.
    - Provide detailed feedback on correctness, efficiency, and improvements.
    - Score the code out of 100.
    
    **Coding Question:**  
    ${question}  

    **User's Code:**  
    \`\`\`${language}
    ${userCode}
    \`\`\`
    
    **Response Format:**  
    - Feedback: Detailed analysis of the code.  
    - Score: Numerical value (e.g., "Score: 85/100").`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.text?.trim();
    if (!text) throw new Error("Failed to generate review.");

    // Extract score using regex
    const scoreMatch = text.match(/Score:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;

    return {
      feedback: text,
      score,
    };
  } catch (error) {
    throw new Error("Unable to review code at this time.");
  }
}
