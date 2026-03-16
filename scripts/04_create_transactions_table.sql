-- Create transactions table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON public.transactions(transaction_date);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own transactions"
ON public.transactions FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.members WHERE id = member_id
  )
);

CREATE POLICY "Service role can manage all transactions"
ON public.transactions FOR ALL
USING (auth.role() = 'service_role');
