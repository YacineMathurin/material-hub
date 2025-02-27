"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LockKeyhole, ArrowRight } from "lucide-react";

export default function UnauthenticatedNotice() {
  const { currentUser } = useAuth();

  // If user is authenticated, don't show this component
  if (currentUser) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-[400px] p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 flex justify-center">
          <div className="bg-white/20 p-4 rounded-full">
            <LockKeyhole className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Sign in required
          </h2>

          <p className="text-gray-600 mb-6">
            Please sign in to access this content and continue your journey
          </p>

          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
