import axios from "axios";

const JUDGE0_API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL ?? "";
const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "";

if (!JUDGE0_API_URL || !RAPID_API_KEY) {
  throw new Error("Missing Judge0 API environment variables.");
}

const headers = {
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": RAPID_API_KEY,
  "Content-Type": "application/json",
};

export async function submitCode(sourceCode: string, languageId: number) {
  try {
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      { source_code: sourceCode, language_id: languageId },
      { headers }
    );

    const token = response.data.token;

    let result;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      result = await axios.get(`${JUDGE0_API_URL}/submissions/${token}`, {
        headers,
      });
    } while (result.data.status.id <= 2);

    return result.data;
  } catch (error) {
    return null;
  }
}
