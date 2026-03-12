import { useState, useCallback, useEffect } from 'react'
import { authLib, AuthUser } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const session = await authLib.getSession()
        setUser(session)
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, role: string) => {
      try {
        setLoading(true)
        setError(null)
        // For mock auth, we'll just sign in with test credentials
        const user = await authLib.signIn(email, password)
        setUser(user)
        return user
      } catch (err) {
        const errorMessage = String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        setError(null)

        const user = await authLib.signIn(email, password)
        setUser(user)
        return user
      } catch (err) {
        const errorMessage = String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await authLib.signOut()
      setUser(null)
    } catch (err) {
      setError(String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
