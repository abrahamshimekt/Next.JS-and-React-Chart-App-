"use client";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 text-center p-4">
        <p className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold">404 - Page Not Found!</p>
        <p className="text-xl md:text-xl text-gray-600 mt-4">The page you are looking for does not exist.</p>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Custom404;
