import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yctjcxtwbaaeigawfxkl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testUsers = [
  {
    email: 'alex@email.com',
    password: 'Test@1234',
    fullName: 'Alex Cruz',
    phone: '0917-123-4567',
    type: 'member',
  },
  {
    email: 'maria@email.com',
    password: 'Test@1234',
    fullName: 'Maria Santos',
    phone: '0917-234-5678',
    type: 'member',
  },
  {
    email: 'john@email.com',
    password: 'Test@1234',
    fullName: 'John Doe',
    phone: '0917-345-6789',
    type: 'member',
  },
  {
    email: 'joaquin@bearfit.com',
    password: 'Test@1234',
    fullName: 'Joaquin Lopez',
    phone: '0917-456-7890',
    type: 'staff',
  },
  {
    email: 'maria@bearfit.com',
    password: 'Test@1234',
    fullName: 'Maria Gonzalez',
    phone: '0917-567-8901',
    type: 'staff',
  },
];

async function createTestUsers() {
  console.log('[v0] Starting test user creation...\n');

  for (const user of testUsers) {
    try {
      console.log(`[v0] Creating ${user.type}: ${user.email}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`[v0] Error creating ${user.email}:`, error.message);
        continue;
      }

      console.log(`[v0] Successfully created user: ${user.email}`);
      console.log(`[v0] User ID: ${data.user.id}`);
      console.log(`[v0] Email: ${data.user.email}`);
      console.log(`[v0] Password: ${user.password}\n`);
    } catch (err) {
      console.error(`[v0] Failed to create ${user.email}:`, err.message);
    }
  }

  console.log('[v0] Test user creation complete!');
  console.log('[v0] You can now use these credentials to sign in to the app.');
}

createTestUsers().catch(console.error);
