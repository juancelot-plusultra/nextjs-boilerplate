import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data
const sampleMembers = [
  {
    user_id: 'user_1',
    branch_id: 'branch_001',
    avatar: 'AC',
    phone: '0917-123-4567',
    email: 'alex@email.com',
    package_id: 'full48',
    status: 'active',
    sessions_left: 19,
    total_sessions: 48,
    join_date: '2025-01-01',
    total_paid: 47500,
  },
  {
    user_id: 'user_2',
    branch_id: 'branch_001',
    avatar: 'MS',
    phone: '0919-345-6789',
    email: 'maria@email.com',
    package_id: 'pt',
    status: 'active',
    sessions_left: 12,
    total_sessions: 24,
    join_date: '2024-12-01',
    total_paid: 24000,
  },
  {
    user_id: 'user_3',
    branch_id: 'branch_001',
    avatar: 'JR',
    phone: '0918-234-5678',
    email: 'john@email.com',
    package_id: 'staggered24',
    status: 'active',
    sessions_left: 8,
    total_sessions: 24,
    join_date: '2025-02-01',
    total_paid: 9200,
  },
];

const sampleStaff = [
  {
    user_id: 'staff_1',
    branch_id: 'branch_001',
    avatar: 'J',
    role: 'Personal Trainer',
    status: 'online',
    phone: '0917-111-2222',
    email: 'joaquin@bearfit.com',
    clients_count: 18,
    rating: 4.9,
    total_sessions: 24,
  },
  {
    user_id: 'staff_2',
    branch_id: 'branch_001',
    avatar: 'M',
    role: 'Yoga Instructor',
    status: 'online',
    phone: '0918-222-3333',
    email: 'maria@bearfit.com',
    clients_count: 15,
    rating: 4.8,
    total_sessions: 20,
  },
];

async function seedData() {
  try {
    console.log('Starting database seeding...');

    // Insert members
    console.log('Inserting members...');
    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .insert(sampleMembers)
      .select();

    if (membersError) {
      console.error('Error inserting members:', membersError);
    } else {
      console.log(`✓ Inserted ${membersData?.length || 0} members`);
    }

    // Insert staff
    console.log('Inserting staff...');
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .insert(sampleStaff)
      .select();

    if (staffError) {
      console.error('Error inserting staff:', staffError);
    } else {
      console.log(`✓ Inserted ${staffData?.length || 0} staff members`);
    }

    // Insert sample sessions if members exist
    if (membersData && membersData.length > 0 && staffData && staffData.length > 0) {
      console.log('Inserting sessions...');
      const sessions = [
        {
          member_id: membersData[0].id,
          staff_id: staffData[0].id,
          branch_id: 'branch_001',
          session_type: 'Weights Session',
          session_date: new Date().toISOString().split('T')[0],
          start_time: '10:00',
          duration_minutes: 60,
          status: 'done',
          notes: 'Great workout today',
        },
        {
          member_id: membersData[1].id,
          staff_id: staffData[1].id,
          branch_id: 'branch_001',
          session_type: 'Personal Training',
          session_date: new Date().toISOString().split('T')[0],
          start_time: '14:00',
          duration_minutes: 60,
          status: 'soon',
          notes: 'Core and flexibility',
        },
      ];

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .insert(sessions)
        .select();

      if (sessionsError) {
        console.error('Error inserting sessions:', sessionsError);
      } else {
        console.log(`✓ Inserted ${sessionsData?.length || 0} sessions`);
      }
    }

    // Insert sample transactions
    if (membersData && membersData.length > 0) {
      console.log('Inserting transactions...');
      const transactions = [
        {
          member_id: membersData[0].id,
          package_id: 'full48',
          branch_id: 'branch_001',
          amount: 47500,
          transaction_type: 'Package Renewal',
          status: 'completed',
        },
        {
          member_id: membersData[1].id,
          package_id: 'pt',
          branch_id: 'branch_001',
          amount: 24000,
          transaction_type: 'PT Session',
          status: 'completed',
        },
      ];

      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .insert(transactions)
        .select();

      if (transError) {
        console.error('Error inserting transactions:', transError);
      } else {
        console.log(`✓ Inserted ${transData?.length || 0} transactions`);
      }
    }

    console.log('✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
