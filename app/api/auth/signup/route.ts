import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // For dummy auth, just validate and return success
    // In a real app, you would create the user in your database
    
    return NextResponse.json({
      success: true,
      message: 'Signup successful. Use these credentials to login.',
      user: {
        id: Math.random().toString(36).substring(7),
        email,
        name: fullName,
        role: 'member', // New signups are members by default
      }
    });
  } catch (error: any) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
