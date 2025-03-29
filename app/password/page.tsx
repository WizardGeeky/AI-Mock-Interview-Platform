"use client";

import React, { useState } from "react";

export default function Page() {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/auth/v.0.0/resetlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setIsVerified(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col text-center items-center bg-white p-6 w-full max-w-md">
        {!isVerified ? (
          <form onSubmit={handleSubmit} className="w-full">
            <p className="text-2xl text-yellow-600 font-semibold">
              Verify Your Email
            </p>
            <p className="text-sm text-gray-400 py-2">
              Enter your registered email address to receive a password reset
              link.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-4 px-3 py-2 border border-yellow-400 rounded-md w-full text-center"
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-md w-full hover:bg-yellow-700"
              disabled={loading}
            >
              {loading ? "Sending..." : "Verify Email"}
            </button>
          </form>
        ) : (
          <div className="w-full">
            <p className="text-2xl text-green-600 font-semibold">
              Email Verified!
            </p>
            <p className="text-sm text-gray-400 py-2">
              A password reset link has been sent to{" "}
              <span className="text-yellow-600 font-semibold">{email}</span>.
            </p>
            <button
              onClick={() => setIsVerified(false)}
              className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-md w-full hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
