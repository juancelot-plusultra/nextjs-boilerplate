import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Member, Staff, Session, Transaction } from './supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface DashboardData {
  memberData?: Member;
  staffData?: Staff;
  sessions: Session[];
  transactions: Transaction[];
  isLoading: boolean;
  error?: string;
}

export function useDashboardData(userId?: string): DashboardData {
  const [memberData, setMemberData] = useState<Member | undefined>();
  const [staffData, setStaffData] = useState<Staff | undefined>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log('[v0] No authenticated user found, using demo data');
          setIsLoading(false);
          return;
        }

        const currentUserId = user.id;

        // Try to fetch member data
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', currentUserId)
          .single()
          .catch(() => ({ data: null, error: null }));

        if (memberData) {
          setMemberData(memberData as Member);

          // Fetch member's sessions
          const { data: sessionsData } = await supabase
            .from('sessions')
            .select('*')
            .eq('member_id', memberData.id)
            .order('session_date', { ascending: false })
            .limit(5);

          if (sessionsData) {
            setSessions(sessionsData as Session[]);
          }

          // Fetch member's transactions
          const { data: transactionsData } = await supabase
            .from('transactions')
            .select('*')
            .eq('member_id', memberData.id)
            .order('transaction_date', { ascending: false })
            .limit(5);

          if (transactionsData) {
            setTransactions(transactionsData as Transaction[]);
          }
        }

        // Try to fetch staff data
        const { data: staffData } = await supabase
          .from('staff')
          .select('*')
          .eq('user_id', currentUserId)
          .single()
          .catch(() => ({ data: null }));

        if (staffData) {
          setStaffData(staffData as Staff);

          // Fetch staff's sessions for today
          const today = new Date().toISOString().split('T')[0];
          const { data: staffSessions } = await supabase
            .from('sessions')
            .select('*')
            .eq('staff_id', staffData.id)
            .eq('session_date', today)
            .order('start_time', { ascending: true });

          if (staffSessions) {
            setSessions(staffSessions as Session[]);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('[v0] Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    memberData,
    staffData,
    sessions,
    transactions,
    isLoading,
    error,
  };
}
