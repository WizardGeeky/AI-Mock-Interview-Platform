"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { jobs } from "@/app/constants/Jobs";
import { VscRobot } from "react-icons/vsc";
import { decodeToken } from "@/app/utils/token";
import { encryptData } from "@/app/utils/cipher";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

export default function Portal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
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
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/");
  };

  const handleStartInterview = (job: any) => {
    router.push(
      `/components/interview?user=${encryptData(userEmail)}&mock=${encryptData(
        job.name
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-white text-white">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-black to-yellow-700 shadow-lg">
        <div className="w-full mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold flex items-center gap-2"
          >
            <VscRobot size={30} /> AI Mock
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center gap-6">
            <Link
              href="/components/profile"
              className="hover:text-white transition font-semibold text-xl flex items-center justify-center gap-2"
            >
              <CgProfile /> Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-white text-yellow-700 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-yellow-200 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden  text-white px-6 py-4 space-y-3 animate-slide-down">
            <Link
              href="/components/profile"
              className="hover:text-white transition text-md font-semibold flex justify-center items-center gap-2"
            >
              <CgProfile /> Profile
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

      {/* Jobs Grid Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-black mb-6 py-3">
          Explore AI-Powered Mock Interviews 🚀
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-lg rounded-md overflow-hidden transform hover:scale-105 transition duration-300 border border-yellow-800"
            >
              <img
                src={job.image}
                alt={job.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">{job.name}</h3>

                <button
                  onClick={() => handleStartInterview(job)}
                  className="mt-4 block text-center bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition w-full"
                >
                  🚀 Start AI Mock Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
