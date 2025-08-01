"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { s } from "framer-motion/dist/types.d-Bq-Qm38R";

export default function Navigation() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FoodWaste</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/insights"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Settings
            </Link>
          </div>

          {user ? (
            // Logout Button
            <Button
              asChild
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              onClick={() => {
                localStorage.removeItem("user");
                setUser(null);
                router.push("/login");
              }}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <LogIn className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </Button>
          ) : (
            // Login Button
            <Button
              asChild
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            >
              <Link href="/login" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
