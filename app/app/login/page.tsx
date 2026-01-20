export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="text-xl font-extrabold tracking-tight">
            Bear<span className="text-[#f37120]">Fit</span>PH
          </a>

          <a
            href="/#contact"
            className="rounded-full bg-[#f37120] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Join Now
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex max-w-6xl items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
          {/* Left info */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-extrabold leading-tight">
              Welcome back to{" "}
              <span className="text-[#f37120]">BearFit PH</span>
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              Sign in to access your client portal: sessions left, package details,
              and updates.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="text-sm font-semibold">What you’ll see inside</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-[#f37120]">✓</span> Remaining sessions & package
                </li>
                <li className="flex gap-2">
                  <span className="text-[#f37120]">✓</span> Check-in history (later)
                </li>
                <li className="flex gap-2">
                  <span className="text-[#f37120]">✓</span> Announcements & reminders (later)
                </li>
              </ul>
            </div>

            <a
              href="/"
              className="mt-6 inline-block text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              ← Back to Home
            </a>
          </div>

          {/* Login form */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-extrabold">Client Login</h2>
            <p className="mt-1 text-sm text-slate-600">
              Use your registered email and password.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Next step: connect this to Supabase Auth ✅");
              }}
            >
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-[#f37120]/30 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-[#f37120]/30 focus:ring-4"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#f37120] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Sign In
              </button>

              <div className="text-center text-xs text-slate-500">
                Forgot your password? We’ll add reset next.
              </div>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 ring-1 ring-slate-200">
              Admin note: we’ll connect Supabase Auth + route users to{" "}
              <span className="font-semibold">/dashboard</span>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


