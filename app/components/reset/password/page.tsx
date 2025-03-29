"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PasswordResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get("resetLink");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  useEffect(() => {
    setIsValid(!!resetToken);
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/v.0.0/resetpwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Password reset successfully! You can now log in.");
      setIsResetSuccessful(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isValid === false) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p className="text-red-500 text-xl font-semibold">Invalid or Expired URL</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-white">
      <div className="flex flex-col text-center items-center bg-white p-6 w-full max-w-md">
        <p className="text-2xl text-yellow-600 font-semibold">Change Password</p>
        <p className="text-sm text-gray-500 py-2">Enter a new password to reset your account.</p>

        {success ? (
          <div className="mt-4">
            <p className="text-green-600 text-sm">{success}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700 transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="my-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="New Password"
                className="w-full px-3 py-2 border border-yellow-600 rounded-md text-center"
              />
            </div>

            <div className="my-4">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-yellow-600 rounded-md text-center"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-md w-full hover:bg-yellow-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PasswordResetLink() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <PasswordResetForm />
    </Suspense>
  );
}
