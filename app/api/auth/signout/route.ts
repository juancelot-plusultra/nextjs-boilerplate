import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);

  let response = NextResponse.json({ success: true });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    await supabase.auth.signOut();
    console.log('[v0] User signed out successfully');
  } catch (error: any) {
    console.error('[v0] Signout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return response;
}
