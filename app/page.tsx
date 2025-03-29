"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VscRobot } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { decodeToken } from "./utils/token";

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        router.push("/components/portal");
      } else {
        sessionStorage.removeItem("token");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignIn) {
        // Login API Call
        const response = await fetch("/api/auth/v.0.0/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        // Store Token in Session Storage
        sessionStorage.setItem("token", data.token);
        router.push("/components/portal");
      } else {
        // Sign Up API Call
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const response = await fetch("/api/auth/v.0.0/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Registration failed");

        alert("Registration Successful! Please sign in.");
        setIsSignIn(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-2 lg:p-6 flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start px-6 py-4 bg-inherit"
        >
          <h1 className="text-yellow-600 text-2xl sm:text-3xl lg:text-5xl font-bold">
            AI
          </h1>
          <p className="text-yellow-600 text-sm sm:text-lg lg:text-xl font-semibold">
            Mock Interview
          </p>
        </motion.nav>
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="flex justify-center items-center px-4 py-10 lg:p-14 w-full"
      >
        <div className="w-full sm:w-10/12 flex items-center justify-center">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full max-w-[80%] sm:w-6/12 md:w-4/12"
            onSubmit={handleSubmit}
          >
            <motion.div className="flex flex-col items-center justify-center">
              <VscRobot className="text-yellow-600 text-6xl" />
              <p className="text-pretty font-bold text-center my-2 text-sm text-yellow-700">
                {isSignIn
                  ? "Sign In to AI Mock Interview"
                  : "Create an Account"}
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Full Name (Only in Sign Up) */}
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="my-4"
              >
                <input
                  type="text"
                  className="rounded-sm py-3 px-3 border border-yellow-600 w-full"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </motion.div>
            )}

            {/* Email */}
            <motion.div className="my-4">
              <input
                type="email"
                className="rounded-sm py-3 px-3 border border-yellow-600 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div className="my-4">
              <input
                type="password"
                className="rounded-sm py-3 px-3 border border-yellow-600 w-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            {/* Confirm Password (Only in Sign Up) */}
            {!isSignIn && (
              <motion.div className="my-4">
                <input
                  type="password"
                  className="rounded-sm py-3 px-3 border border-yellow-600 w-full"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </motion.div>
            )}

            {/* Forgot Password */}
            {isSignIn && (
              <div className="text-right mb-4">
                <a
                  href="/password"
                  className="text-yellow-600 text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button className="w-full py-3 bg-yellow-600 text-white rounded-sm font-semibold">
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>

            <p className="text-center py-1">or</p>

            {/* Toggle Sign In / Sign Up */}
            <button
              type="button"
              onClick={() => setIsSignIn(!isSignIn)}
              className="w-full py-3 bg-white text-yellow-600 rounded-sm font-semibold border"
            >
              {isSignIn ? "Create an Account" : "Sign In"}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
