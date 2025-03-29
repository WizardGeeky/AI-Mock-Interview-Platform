"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { submitCode } from "@/app/utils/judge0";
import { LANGUAGE_OPTIONS } from "@/app/constants/Languages";
import { decodeToken } from "@/app/utils/token";
import { decryptData } from "@/app/utils/cipher";
import { generateInterviewQuestion } from "@/app/config/ai-config";

export default function MockInterview() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = searchParams.get("user");
  const mock = searchParams.get("mock");

  const [isValid, setIsValid] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [output, setOutput] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !mock ) {
      setIsValid(false);
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token || !decodeToken(token)) {
      router.push("/");
      return;
    }

    const fetchQuestion = async () => {
      setLoadingQuestion(true);
      try {
        const generatedQuestion = await generateInterviewQuestion(
          decryptData(mock)
        );
        setQuestion(generatedQuestion.question);
      } catch {
        setQuestion("Failed to generate a coding question. Please try again.");
      }
      setLoadingQuestion(false);
    };

    if (!question) {
      fetchQuestion();
    }
  }, [router, user, mock]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code before running.");
      return;
    }
  
    setOutput("Executing...");
    const result = await submitCode(code, language.id);
    setOutput(result?.stdout || result?.stderr || "Execution error.");
  };
  
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code before submitting.");
      return;
    }
  
    if (!question) {
      setFeedback("Question not loaded. Please wait.");
      return;
    }
  
    setLoadingSubmit(true);
    setFeedback(null);
    setScore(null);
  
    try {
      const token = sessionStorage.getItem("token");
      const decodedUser = token ? decodeToken(token) : null;
      if (!decodedUser) {
        router.push("/");
        return;
      }
  
      const response = await fetch("/api/auth/v.0.0/mocktest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user,
          jobTitle: decryptData(mock || ""),
          question,
          code,
          language: language.name,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setFeedback(data?.interview?.feedback || "No feedback available.");
        setScore(data?.interview?.score || 0);
      } else {
        setFeedback(`Submission failed: ${data.message || "Try again."}`);
      }
    } catch (error) {
      setFeedback("Error submitting code. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        Invalid link or unauthorized access.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <nav className="w-full bg-yellow-600 px-6 text-white">
        <h1 className="text-2xl py-6 font-bold">AI Mock Interview</h1>
      </nav>

      <div className="w-full flex flex-col lg:flex-row flex-grow">
        {/* Left Column: AI-Generated Question */}
        <div className="w-full lg:w-1/2 p-6 max-h-screen overflow-auto border-r border-gray-300">
          <h2 className="text-xl font-semibold text-yellow-600">Question</h2>
          {loadingQuestion ? (
            <p className="text-gray-500 mt-2">Generating question...</p>
          ) : (
            <p className="text-gray-600 mt-2 whitespace-pre-line">{question}</p>
          )}
        </div>

        {/* Right Column: Code Editor */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col min-h-screen">
          <h2 className="text-xl font-semibold text-yellow-600">Code Editor</h2>

          <select
            className="w-full p-2 border my-2 border-yellow-600 rounded-md"
            value={language.id}
            onChange={(e) => {
              const selectedLang = LANGUAGE_OPTIONS.find(
                (lang) => lang.id === Number(e.target.value)
              );
              if (selectedLang) setLanguage(selectedLang);
            }}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <div className="border border-yellow-600 rounded-sm flex-grow overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={language.monacoLang}
              theme="vs-light"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <button
            className="mt-4 p-2 bg-yellow-600 text-white rounded-md font-semibold w-full"
            onClick={handleRunCode}
          >
            Run Code
          </button>

          <button
            className="mt-4 p-2 bg-yellow-600 text-white font-semibold rounded-md w-full"
            onClick={handleSubmitCode}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Submitting..." : "Submit Code"}
          </button>

          <pre className="mt-4 p-3 border bg-gray-800 text-white text-sm overflow-auto rounded-sm h-24">
            {output || "Output will appear here..."}
          </pre>

          
        </div>
      </div>

      {feedback && (
            <div className="mt-4 p-3 border border-yellow-600 rounded-md bg-gray-50">
              <h3 className="font-semibold text-yellow-600">AI Feedback:</h3>
              <p className="text-gray-700">{feedback}</p>
              <p className="text-gray-800 font-semibold">Score: {score}/100</p>
            </div>
          )}
    </div>
  );
}
