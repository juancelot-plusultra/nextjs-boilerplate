'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as AuthUser } from '@supabase/supabase-js'
import { supabase, User as ProfileUser } from '@/lib/supabase'

interface UserContextType {
  user: AuthUser | null
  profile: ProfileUser | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  refetchProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchUserProfile(userId: string) {
    try {
      console.log('[v0] Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[v0] Error fetching profile:', error.message)
        setError(error.message)
        return
      }

      console.log('[v0] Profile fetched successfully:', data)
      setProfile(data as ProfileUser)
    } catch (err: any) {
      console.error('[v0] Unexpected error fetching profile:', err)
      setError(err.message)
    }
  }

  async function refetchProfile() {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  async function handleSignOut() {
    try {
      console.log('[v0] Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      console.log('[v0] Sign out successful')
    } catch (err: any) {
      console.error('[v0] Error during sign out:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('[v0] Checking authentication status...')
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('[v0] Error getting session:', error.message)
          setError(error.message)
          setUser(null)
          setProfile(null)
          return
        }

        if (data.session?.user) {
          console.log('[v0] User found:', data.session.user.id)
          setUser(data.session.user)
          await fetchUserProfile(data.session.user.id)
        } else {
          console.log('[v0] No active session')
          setUser(null)
          setProfile(null)
        }
      } catch (err: any) {
        console.error('[v0] Unexpected error checking auth:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[v0] Auth state changed:', event)
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signOut: handleSignOut,
        refetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
