import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simple validation - in production this would check against database
    const mockUsers: Record<string, { password: string; role: string }> = {
      'member@bearfit.com': { password: 'password123', role: 'member' },
      'staff@bearfit.com': { password: 'password123', role: 'staff' },
      'lead@bearfit.com': { password: 'password123', role: 'lead' },
      'admin@bearfit.com': { password: 'password123', role: 'admin' },
    };

    const user = mockUsers[email.toLowerCase()];
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: email,
        email: email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('[v0] Signin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
