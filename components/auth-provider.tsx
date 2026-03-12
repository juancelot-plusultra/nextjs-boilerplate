"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { getUser } from "@/lib/auth";

export function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: ReactNode;
  requiredRoles?: string[];
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.push("/member/dashboard");
      return;
    }

    setIsReady(true);
  }, [user, requiredRoles, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
