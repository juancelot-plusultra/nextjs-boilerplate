// Mock authentication system using localStorage
// This replaces Supabase auth for development/testing

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'member' | 'staff' | 'lead' | 'admin'
  avatar?: string
  phone?: string
}

// Mock user database
const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'member@test.com',
    password: 'password123',
    name: 'Alex Cruz',
    role: 'member' as const,
    avatar: 'AC',
    phone: '0917-123-4567',
  },
  {
    id: 'user-2',
    email: 'staff@test.com',
    password: 'password123',
    name: 'Coach Joaquin',
    role: 'staff' as const,
    avatar: 'J',
    phone: '0917-111-2222',
  },
  {
    id: 'user-3',
    email: 'lead@test.com',
    password: 'password123',
    name: 'Lead Sales',
    role: 'lead' as const,
    avatar: 'LS',
    phone: '0917-222-3333',
  },
  {
    id: 'user-4',
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin' as const,
    avatar: 'AU',
    phone: '0917-333-4444',
  },
]

const STORAGE_KEY = 'auth_session'

export const authLib = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<AuthUser> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = MOCK_USERS.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const { password: _, ...authUser } = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    return authUser
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    localStorage.removeItem(STORAGE_KEY)
  },

  // Get current session
  getSession: async (): Promise<AuthUser | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))

    const sessionStr = localStorage.getItem(STORAGE_KEY)
    if (!sessionStr) return null

    try {
      return JSON.parse(sessionStr)
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(STORAGE_KEY)
  },

  // Get user role
  getUserRole: (): string | null => {
    if (typeof window === 'undefined') return null
    const sessionStr = localStorage.getItem(STORAGE_KEY)
    if (!sessionStr) return null

    try {
      const user = JSON.parse(sessionStr)
      return user.role
    } catch {
      return null
    }
  },
}
