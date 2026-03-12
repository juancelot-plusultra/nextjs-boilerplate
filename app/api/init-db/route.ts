import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Initializing database...');

    // Create users table
    const { error: usersError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS auth.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
    });

    // Create members table
    const { error: membersError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS public.members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          full_name VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(20),
          branch_id VARCHAR(50),
          avatar VARCHAR(500),
          package_id VARCHAR(50),
          status VARCHAR(50) DEFAULT 'active',
          sessions_left INT DEFAULT 0,
          total_sessions INT DEFAULT 0,
          join_date DATE,
          total_paid DECIMAL(10, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
      `,
    });

    // Create staff table
    const { error: staffError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS public.staff (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          full_name VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(20),
          branch_id VARCHAR(50),
          avatar VARCHAR(500),
          role VARCHAR(50),
          status VARCHAR(50) DEFAULT 'online',
          clients_count INT DEFAULT 0,
          rating DECIMAL(3, 2) DEFAULT 0,
          total_sessions INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
      `,
    });

    // Create sessions table
    const { error: sessionsError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS public.sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          member_id UUID NOT NULL,
          staff_id UUID NOT NULL,
          branch_id VARCHAR(50),
          session_type VARCHAR(100),
          session_date DATE,
          start_time TIME,
          duration_minutes INT,
          status VARCHAR(50) DEFAULT 'soon',
          notes TEXT,
          rating INT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
          FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE
        );
      `,
    });

    // Create transactions table
    const { error: transError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS public.transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          member_id UUID NOT NULL,
          package_id VARCHAR(50),
          branch_id VARCHAR(50),
          amount DECIMAL(10, 2),
          transaction_type VARCHAR(50),
          status VARCHAR(50) DEFAULT 'pending',
          transaction_date TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
        );
      `,
    });

    const errors = [
      usersError,
      membersError,
      staffError,
      sessionsError,
      transError
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized'
    });

  } catch (error: any) {
    console.error('[v0] Database init error:', error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
