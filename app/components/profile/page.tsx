"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "@/app/utils/token";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { VscRobot } from "react-icons/vsc";
import { IoHome } from "react-icons/io5";
import { encryptData } from "@/app/utils/cipher";

interface Interview {
  _id: string;
  jobTitle: string;
  createdAt: string;
  score: string;
  question:string;
}

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [mockInterviews, setMockInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.email) {
      router.push("/");
      return;
    }

    setUserEmail(decoded.email);
    fetchMockInterviews(decoded.email);
  }, [router]);

  const fetchMockInterviews = async (email: string) => {
    try {
      const response = await fetch("/api/auth/v.0.0/user/mocktests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: encryptData(email) }),
      });

      const data = await response.json();
      if (data.success) {
        setMockInterviews(data.interviews);
      } else {
        setError(data.message || "Error fetching data.");
      }
    } catch (err) {
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-black to-yellow-700 shadow-lg">
        <div className="w-full mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-extrabold flex items-center gap-2 text-white"
          >
            <VscRobot size={30} /> AI Mock
          </Link>

          <div className="hidden md:flex space-x-6 items-center gap-6">
            <Link
              href="/components/portal"
              className="hover:text-white transition font-semibold text-xl flex items-center gap-2 text-white"
            >
              <IoHome /> Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-yellow-700 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-yellow-200 transition"
            >
              Logout
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden text-white px-6 py-4 space-y-3 animate-slide-down">
            <Link
              href="/components/portal"
              className="hover:text-white transition text-md font-semibold flex items-center justify-center gap-2"
            >
              <IoHome /> Home
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-center bg-white text-yellow-700 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-yellow-200 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Mock Interviews Section */}
      <div className="w-full h-auto p-5 lg:p-10">
        <h2 className="text-black font-semibold text-lg lg:text-2xl">
          Mock Interviews History
        </h2>
        <p className="text-xs lg:text-sm text-gray-500">
          Know your mock interviews
        </p>

        {loading && (
          <p className="text-gray-700 mt-4">Loading mock interviews...</p>
        )}
        {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}

        {!loading && !error && mockInterviews.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-yellow-500 text-white text-left">
                  <th className="p-3 border border-gray-300">#</th>
                  <th className="p-3 border border-gray-300">Job Title</th>
                  <th className="p-3 border border-gray-300">Test Question</th>
                  <th className="p-3 border border-gray-300">Score</th>
                  <th className="p-3 border border-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockInterviews.map((interview, index) => (
                  <tr
                    key={interview._id}
                    className="text-gray-800 border border-gray-300 hover:bg-yellow-100 transition"
                  >
                    <td className="p-3 border border-gray-300">{index + 1}</td>
                    <td className="p-3 border border-gray-300">
                      {interview.jobTitle}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {interview.question.replace("## Problem Statement","")}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {interview.score} /100
                    </td>
                    <td className="p-3 border border-gray-300">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && mockInterviews.length === 0 && (
          <p className="text-gray-600 mt-4">No mock interviews found.</p>
        )}
      </div>
    </div>
  );
}
