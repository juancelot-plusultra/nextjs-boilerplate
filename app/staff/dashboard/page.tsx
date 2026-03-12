"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { User } from "@/lib/auth";

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    if (currentUser.role !== "staff") {
      router.push("/member/dashboard");
      return;
    }
    
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F6FA] to-[#ECEEF4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F37120] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6FA] to-[#ECEEF4]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827]">
              Bear<span className="text-[#F37120]">Fit</span>PH
            </h1>
            <p className="text-sm text-[#6B7280]">Staff Dashboard</p>
          </div>
          <button
            onClick={() => logout()}
            className="px-6 py-2 rounded-full bg-[#F37120] text-white font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <h2 className="text-2xl font-extrabold text-[#111827] mb-4">
            Welcome, {user?.email}!
          </h2>
          <p className="text-[#6B7280] mb-6">
            You are logged in as a <span className="font-semibold text-[#F37120]">Staff Member</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-br from-[#F37120]/10 to-[#F37120]/5 rounded-xl p-6 border border-[#F37120]/20">
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Quick Actions</h3>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>✓ Check in members</li>
                <li>✓ View client schedules</li>
                <li>✓ Log workout sessions</li>
                <li>✓ Message clients</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-5 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Today's Schedule</h3>
              <p className="text-sm text-[#6B7280]">No sessions scheduled yet</p>
              <p className="text-xs text-[#9CA3AF] mt-4">Check the full dashboard for your complete schedule</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#FEF3E2] rounded-lg border border-[#F37120]/20">
            <p className="text-sm text-[#D97706]">
              <strong>Note:</strong> This is a demonstration dashboard. The full staff features are being built out in the member dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
