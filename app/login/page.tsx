"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect all login requests to the welcome page
    router.push("/welcome");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F6FA] to-[#ECEEF4] px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
          <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Redirecting to welcome...</p>
      </div>
    </div>
  );
}
              href="/forgot-password"
              className="text-sm font-medium text-[#F37120] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F37120] py-4 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-sm text-[#9CA3AF]">Or continue with</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        {/* SOCIAL LOGIN (UI ONLY) */}
        <div className="flex justify-center gap-4 mb-8">
          <button className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB]">
            <Image src="/icons/google.svg" alt="Google" width={22} height={22} />
          </button>
          <button className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB]">
            <Image src="/icons/apple.svg" alt="Apple" width={22} height={22} />
          </button>
          <button className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB]">
            <Image src="/icons/facebook.svg" alt="Facebook" width={22} height={22} />
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-[#6B7280]">
          Not a member?{" "}
          <a
            href="/onboarding"
            className="font-semibold text-[#F37120] hover:underline"
          >
            Register now
          </a>
        </div>

        <div className="mt-8 space-y-2 text-center text-xs text-[#9CA3AF] leading-relaxed">
          <p className="font-semibold text-[#6B7280]">Test Credentials:</p>
          <p>Member: member@test.com</p>
          <p>Staff: staff@test.com</p>
          <p>Lead: lead@test.com</p>
          <p>Admin: admin@test.com</p>
          <p className="text-[#6B7280]">Password: password123</p>
        </div>
      </div>

      {/* SIMPLE FADE ANIMATION */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
