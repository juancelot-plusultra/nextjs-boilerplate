-- Insert branches
INSERT INTO branches (id, name, location, address, phone, email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sikatuna Village', 'Quezon City', '48 Malingap Street, Sikatuna Village, Quezon City', '0917-XXX-XXXX', 'sikatuna@bearfit.ph'),
('550e8400-e29b-41d4-a716-446655440002', 'E. Rodriguez', 'Quezon City', 'G/F Puzon Building, 1118 E. Rodriguez Sr. Avenue, Quezon City', '0918-XXX-XXXX', 'erodriguez@bearfit.ph'),
('550e8400-e29b-41d4-a716-446655440003', 'Cainta', 'Rizal', '271 Ortigas Ave Ext, Cainta, Rizal', '0919-XXX-XXXX', 'cainta@bearfit.ph')
ON CONFLICT DO NOTHING;

-- Insert packages
INSERT INTO packages (id, name, type, total_sessions, price_pesos, description) VALUES
('550e8400-e29b-41d4-a716-446655450001', 'Full 48 Package+', 'full48', 48, 47500, 'Full 48 sessions with exclusive coach access'),
('550e8400-e29b-41d4-a716-446655450002', 'Full 24', 'full24', 24, 25200, '24 sessions with dedicated coach'),
('550e8400-e29b-41d4-a716-446655450003', 'Staggered 24', 'staggered24', 24, 9200, '24 sessions over flexible schedule'),
('550e8400-e29b-41d4-a716-446655450004', 'Staggered 48', 'staggered48', 48, 18400, '48 sessions over extended period'),
('550e8400-e29b-41d4-a716-446655450005', 'Personal Training', 'pt', 12, 24000, '12 one-on-one training sessions'),
('550e8400-e29b-41d4-a716-446655450006', 'Pilates', 'pilates', 12, 12000, '12 pilates sessions')
ON CONFLICT DO NOTHING;

-- Note: Member and staff accounts should be created via the Supabase auth UI or sign-up flow
-- The dashboard will work with sample member data once users are created in auth.users

-- Insert sample member data (requires corresponding auth.users entries)
-- These are examples that would be created after users sign up
INSERT INTO members (id, user_id, branch_id, avatar, phone, email, package_id, status, sessions_left, total_sessions, join_date, total_paid) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'user-001', '550e8400-e29b-41d4-a716-446655440001', 'AC', '0917-123-4567', 'alex@email.com', '550e8400-e29b-41d4-a716-446655450001', 'active', 19, 48, '2025-01-01', 47500),
('650e8400-e29b-41d4-a716-446655440002', 'user-002', '550e8400-e29b-41d4-a716-446655440001', 'MS', '0919-345-6789', 'maria@email.com', '550e8400-e29b-41d4-a716-446655450005', 'active', 12, 24, '2024-12-15', 24000),
('650e8400-e29b-41d4-a716-446655440003', 'user-003', '550e8400-e29b-41d4-a716-446655440002', 'JR', '0918-234-5678', 'john@email.com', '550e8400-e29b-41d4-a716-446655450003', 'active', 8, 24, '2025-02-01', 9200),
('650e8400-e29b-41d4-a716-446655440004', 'user-004', '550e8400-e29b-41d4-a716-446655440001', 'SG', '0920-456-7890', 'sofia@email.com', '550e8400-e29b-41d4-a716-446655450002', 'expiring', 3, 24, '2024-08-20', 25200),
('650e8400-e29b-41d4-a716-446655440005', 'user-005', '550e8400-e29b-41d4-a716-446655440003', 'CM', '0921-567-8901', 'carlos@email.com', '550e8400-e29b-41d4-a716-446655450004', 'expired', 0, 48, '2024-06-10', 22500)
ON CONFLICT DO NOTHING;

-- Insert sample staff data
INSERT INTO staff (id, user_id, branch_id, avatar, role, status, phone, email, clients_count, rating, total_sessions) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'staff-001', '550e8400-e29b-41d4-a716-446655440001', 'CJ', 'Coach', 'online', '0917-500-0001', 'joaquin@bearfit.ph', 12, 4.8, 156),
('750e8400-e29b-41d4-a716-446655440002', 'staff-002', '550e8400-e29b-41d4-a716-446655440001', 'CM', 'Coach', 'online', '0917-500-0002', 'maria@bearfit.ph', 10, 4.9, 142),
('750e8400-e29b-41d4-a716-446655440003', 'staff-003', '550e8400-e29b-41d4-a716-446655440002', 'CC', 'Coach', 'offline', '0918-500-0003', 'carlos@bearfit.ph', 8, 4.7, 98)
ON CONFLICT DO NOTHING;

-- Insert sample sessions
INSERT INTO sessions (id, member_id, staff_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes) VALUES
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Weights Session', CURRENT_DATE, '06:00:00', 60, 'done', 'Completed leg day workout'),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Personal Training', CURRENT_DATE, '08:00:00', 60, 'done', 'Upper body focus'),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Cardio Blast', CURRENT_DATE, '10:00:00', 45, 'now', 'HIIT session in progress'),
('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Personal Training', (CURRENT_DATE + INTERVAL '1 day'), '14:00:00', 60, 'soon', 'Core and flexibility'),
('850e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'HIIT Session', (CURRENT_DATE + INTERVAL '2 days'), '16:00:00', 50, 'soon', '8 members registered')
ON CONFLICT DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, member_id, package_id, branch_id, amount, transaction_type, status, transaction_date) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440001', 47500, 'package_purchase', 'completed', '2026-01-15'),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450005', '550e8400-e29b-41d4-a716-446655440001', 24000, 'package_purchase', 'completed', '2026-01-20'),
('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440002', 9200, 'package_purchase', 'completed', '2026-02-01')
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'user-001', 'Session Reminder', 'Weights Session starts in 30 minutes', 'session', false),
('a50e8400-e29b-41d4-a716-446655440002', 'user-001', 'New Year Promo!', 'Get 20% off on all packages this February', 'promo', false),
('a50e8400-e29b-41d4-a716-446655440003', 'user-001', 'Points Earned', 'You earned 50 Bearforce Points!', 'points', false),
('a50e8400-e29b-41d4-a716-446655440004', 'user-001', 'Payment Received', 'Your payment of P2,500 has been confirmed', 'payment', true)
ON CONFLICT DO NOTHING;
