'use client'

export default function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Debug</h1>

        <div className="space-y-6">
          {/* URL Check */}
          <div className="border border-orange-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">URL Status</h2>
            <div className="bg-gray-900 p-4 rounded font-mono text-sm break-all">
              <p className="text-gray-400">NEXT_PUBLIC_SUPABASE_URL:</p>
              <p className={url ? 'text-green-400' : 'text-red-400'}>
                {url || '❌ NOT SET'}
              </p>
            </div>
            <p className="text-gray-400 mt-2">
              {url ? '✅ URL is loaded' : '❌ URL is missing - check Settings > Vars'}
            </p>
          </div>

          {/* Anon Key Check */}
          <div className="border border-orange-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Anon Key Status</h2>
            <div className="bg-gray-900 p-4 rounded font-mono text-sm break-all">
              <p className="text-gray-400">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
              <p className={anonKey ? 'text-green-400' : 'text-red-400'}>
                {anonKey 
                  ? `${anonKey.substring(0, 20)}...${anonKey.substring(anonKey.length - 20)}` 
                  : '❌ NOT SET'}
              </p>
              {anonKey && (
                <p className="text-gray-400 text-xs mt-2">Length: {anonKey.length} characters</p>
              )}
            </div>
            <p className="text-gray-400 mt-2">
              {anonKey ? '✅ Anon key is loaded' : '❌ Anon key is missing - check Settings > Vars'}
            </p>
          </div>

          {/* Both Present Check */}
          <div className="border border-blue-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Overall Status</h2>
            {url && anonKey ? (
              <div className="bg-green-900 border border-green-500 p-4 rounded">
                <p className="text-green-400 font-semibold">✅ ALL CREDENTIALS LOADED</p>
                <p className="text-green-300 text-sm mt-2">Your Supabase connection should work!</p>
              </div>
            ) : (
              <div className="bg-red-900 border border-red-500 p-4 rounded">
                <p className="text-red-400 font-semibold">❌ CREDENTIALS MISSING</p>
                <p className="text-red-300 text-sm mt-2">
                  {!url && 'Missing: NEXT_PUBLIC_SUPABASE_URL'}
                  {!url && !anonKey && ', '}
                  {!anonKey && 'Missing: NEXT_PUBLIC_SUPABASE_ANON_KEY'}
                </p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <ol className="space-y-2 text-gray-400">
              {url && anonKey ? (
                <>
                  <li>✅ Your credentials are loaded correctly</li>
                  <li>Go back to /welcome and try signing up again</li>
                  <li>If you still get "Invalid API key" error:</li>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Check browser console (F12) for detailed error</li>
                    <li>• Verify keys in Supabase dashboard match what's set here</li>
                    <li>• Restart your dev server: npm run dev</li>
                  </ul>
                </>
              ) : (
                <>
                  <li>1. Go to Settings (top right) → Vars</li>
                  <li>2. Add these 3 variables:</li>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                    <li>• SUPABASE_SERVICE_KEY</li>
                  </ul>
                  <li>3. Save and refresh this page</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
