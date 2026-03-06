import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yctjcxtwbaae1gawfxkl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZTFnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const setupDatabase = async () => {
  try {
    console.log('[v0] Starting database setup...');

    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table', {});
    if (usersError && !usersError.message.includes('already exists')) {
      console.log('[v0] Creating users table via SQL...');
      const { data, error } = await supabase.from('users').select('*').limit(1);
      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        const { error: createError } = await supabase.sql`
          CREATE TABLE IF NOT EXISTS public.users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            phone VARCHAR(20),
            role VARCHAR(50) DEFAULT 'member',
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `;
        if (createError) console.error('[v0] Users table error:', createError);
      }
    }

    // Create members table
    const { error: membersError } = await supabase.from('members').select('*').limit(1);
    if (membersError && membersError.code === '42P01') {
      console.log('[v0] Creating members table...');
      const { error: createError } = await supabase.sql`
        CREATE TABLE IF NOT EXISTS public.members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          membership_type VARCHAR(50),
          start_date DATE,
          end_date DATE,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      if (createError) console.error('[v0] Members table error:', createError);
    }

    console.log('[v0] Database setup completed!');
  } catch (error) {
    console.error('[v0] Setup error:', error.message);
  }
};

setupDatabase();
