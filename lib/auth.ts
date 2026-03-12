// Dummy authentication system for testing
// In production, this would connect to a real database and use bcrypt

export interface User {
  id: string;
  email: string;
  role: 'member' | 'staff' | 'leads' | 'admin';
  name: string;
}

// Dummy user credentials for testing
const DUMMY_USERS: Record<string, { password: string; user: User }> = {
  'member@bearfit.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'member@bearfit.com',
      role: 'member',
      name: 'John Member',
    },
  },
  'staff@bearfit.com': {
    password: 'password123',
    user: {
      id: '2',
      email: 'staff@bearfit.com',
      role: 'staff',
      name: 'Coach Joaquin',
    },
  },
  'leads@bearfit.com': {
    password: 'password123',
    user: {
      id: '3',
      email: 'leads@bearfit.com',
      role: 'leads',
      name: 'Sales Manager',
    },
  },
  'admin@bearfit.com': {
    password: 'password123',
    user: {
      id: '4',
      email: 'admin@bearfit.com',
      role: 'admin',
      name: 'Admin User',
    },
  },
};

// Alternative dummy credentials (as suggested by user)
const ALTERNATIVE_USERS: Record<string, { password: string; user: User }> = {
  'johndoe@gmail.com': {
    password: 'johnisgood',
    user: {
      id: '5',
      email: 'johndoe@gmail.com',
      role: 'member',
      name: 'John Doe',
    },
  },
};

// Merge all users
const ALL_USERS = { ...DUMMY_USERS, ...ALTERNATIVE_USERS };

export function authenticateUser(email: string, password: string): User | null {
  const userRecord = ALL_USERS[email];
  if (userRecord && userRecord.password === password) {
    return userRecord.user;
  }
  return null;
}

export function saveUserSession(user: User): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearUserSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('currentUser');
  }
}

export function isUserAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
