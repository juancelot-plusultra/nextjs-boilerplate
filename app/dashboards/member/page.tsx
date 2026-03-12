"use client";

import dynamic from "next/dynamic";

const OriginalDashboard = dynamic(
  () => import("@/app/member/dashboard/page").then((mod) => ({ default: mod.default })),
  { loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div> }
);

export default function MemberDashboardPage() {
  return <OriginalDashboard />;
}
