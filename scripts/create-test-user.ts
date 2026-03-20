import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  try {
    const testEmail = 'test@example.com'
    const testPassword = 'TestPassword123!'

    console.log(`Creating test user: ${testEmail}`)

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User',
        phone: '1234567890',
      },
    })

    if (error) {
      console.error('Error creating user:', error.message)
      process.exit(1)
    }

    console.log('✅ Test user created successfully!')
    console.log('Email:', testEmail)
    console.log('Password:', testPassword)
    console.log('User ID:', data.user?.id)
    console.log('\nYou can now login to the dashboard with these credentials.')
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

createTestUser()
