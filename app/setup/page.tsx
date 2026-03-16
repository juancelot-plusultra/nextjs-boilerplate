'use client';

import { useState } from 'react';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTestUsers = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup/create-test-users', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to create test users');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Setup</h1>
          <p className="text-gray-600 mb-8">Create test users to get started with the application</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Test Users to Create</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">alex@email.com</span>
                <span className="text-sm text-gray-600">Member</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">maria@email.com</span>
                <span className="text-sm text-gray-600">Member</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">john@email.com</span>
                <span className="text-sm text-gray-600">Member</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">joaquin@bearfit.com</span>
                <span className="text-sm text-gray-600">Staff</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">maria@bearfit.com</span>
                <span className="text-sm text-gray-600">Staff</span>
              </div>
              <p className="text-sm text-gray-600 pt-3 border-t border-blue-200">Password: Test@1234 (all users)</p>
            </div>
          </div>

          <button
            onClick={handleCreateTestUsers}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Creating Users...' : 'Create Test Users'}
          </button>

          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Success! Users Created</h3>
              <div className="space-y-2">
                {result.results.map((r: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-700">{r.email}</span>
                    <span className={`text-sm font-medium ${r.status === 'created' ? 'text-green-600' : 'text-gray-600'}`}>
                      {r.status === 'created' ? '✓ Created' : r.status === 'exists_or_error' ? 'Already exists' : 'Error'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Next Step:</strong> Go to{' '}
                  <a href="/member/dashboard" className="text-indigo-600 hover:underline">
                    /member/dashboard
                  </a>
                  {' '}and sign in with any test user credentials above.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
