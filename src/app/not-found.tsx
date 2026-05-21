import Link from "next/link";
import { Plane } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-16">
      <div className="text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Plane className="w-12 h-12 text-orange-500 rotate-45" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like this page flew away! Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Back to Homepage
          </Link>
          <Link
            href="/packages"
            className="border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Browse Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
