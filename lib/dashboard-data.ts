// All dashboard data consolidated in one file

// Member navigation
export const memberNavItems = [
  { icon: 'Home', label: "Home", id: "home" },
  { icon: 'Calendar', label: "Schedule", id: "schedule" },
  { icon: 'CreditCard', label: "Payment", id: "payment" },
  { icon: 'User', label: "Profile", id: "profile" },
  { icon: 'MoreHorizontal', label: "More", id: "more" },
]

// Staff navigation
export const staffNavItems = [
  { icon: 'Home', label: "Home", id: "home" },
  { icon: 'Calendar', label: "Schedule", id: "schedule" },
  { icon: 'Users', label: "Clients", id: "clients" },
  { icon: 'TrendingUp', label: "Stats", id: "stats" },
  { icon: 'MoreHorizontal', label: "More", id: "more" },
]

// Leads navigation
export const leadsNavItems = [
  { icon: 'Home', label: "Dashboard", id: "dashboard" },
  { icon: 'Users', label: "Leads", id: "leads" },
  { icon: 'ClipboardList', label: "Follow-ups", id: "followups" },
  { icon: 'TrendingUp', label: "Pipeline", id: "pipeline" },
  { icon: 'MoreHorizontal', label: "More", id: "more" },
]

// Admin navigation
export const adminNavItems = [
  { icon: 'Home', label: "Dashboard", id: "dashboard" },
  { icon: 'Users', label: "Members", id: "members" },
  { icon: 'PesoIcon', label: "Payments", id: "payments" },
  { icon: 'UserCog', label: "Staff", id: "staff" },
  { icon: 'Settings', label: "Settings", id: "settings" },
]

export const chatMessages = [
  { id: 1, sender: "coach", name: "Coach Joaquin", message: "Great job on your workout today!", time: "2:30 PM" },
  { id: 2, sender: "user", message: "Thanks coach! Feeling stronger.", time: "2:32 PM" },
  { id: 3, sender: "coach", name: "Coach Joaquin", message: "Keep it up! See you tomorrow at 6 PM.", time: "2:33 PM" },
]

export const notifications = [
  { id: 1, type: "session", title: "Session Reminder", message: "Weights Session starts in 30 minutes", time: "Just now", unread: true },
  { id: 2, type: "promo", title: "New Year Promo!", message: "Get 20% off on all packages this February", time: "1h ago", unread: true },
  { id: 3, type: "points", title: "Points Earned", message: "You earned 50 Bearforce Points!", time: "2h ago", unread: true },
  { id: 4, type: "payment", title: "Payment Received", message: "Your payment of P2,500 has been confirmed", time: "Yesterday", unread: false },
]

// Client data for staff with package types
export const clientsData = [
  { id: 1, name: "Alex Cruz", avatar: "AC", package: "Full 48 Package+", packageType: "full48", sessionsLeft: 19, totalSessions: 48, status: "paid", phone: "0917-123-4567", email: "alex@email.com", joinDate: "Jan 2025", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 2, name: "John Reyes", avatar: "JR", package: "Staggered 24", packageType: "staggered24", sessionsLeft: 8, totalSessions: 24, status: "paid", phone: "0918-234-5678", email: "john@email.com", joinDate: "Feb 2025", lastVisit: "Yesterday", coach: "Coach Joaquin" },
  { id: 3, name: "Maria Santos", avatar: "MS", package: "Personal Training", packageType: "pt", sessionsLeft: 12, totalSessions: 24, status: "paid", phone: "0919-345-6789", email: "maria@email.com", joinDate: "Dec 2024", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 4, name: "Sofia Garcia", avatar: "SG", package: "Full 24", packageType: "full24", sessionsLeft: 3, totalSessions: 24, status: "expiring", phone: "0920-456-7890", email: "sofia@email.com", joinDate: "Aug 2024", lastVisit: "3 days ago", coach: "Coach Maria" },
  { id: 5, name: "Carlos Mendoza", avatar: "CM", package: "Staggered 48", packageType: "staggered48", sessionsLeft: 0, totalSessions: 48, status: "unpaid", phone: "0921-567-8901", email: "carlos@email.com", joinDate: "Jun 2024", lastVisit: "2 weeks ago", coach: "Coach Carlos" },
  { id: 6, name: "Anna Lim", avatar: "AL", package: "Pilates", packageType: "pilates", sessionsLeft: 6, totalSessions: 12, status: "paid", phone: "0922-678-9012", email: "anna@email.com", joinDate: "Jan 2026", lastVisit: "Today", coach: "Coach Maria" },
  { id: 7, name: "Miguel Torres", avatar: "MT", package: "Full 24", packageType: "full24", sessionsLeft: 20, totalSessions: 24, status: "paid", phone: "0923-789-0123", email: "miguel@email.com", joinDate: "Nov 2025", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 8, name: "Isabella Fernandez", avatar: "IF", package: "Full 48 Package+", packageType: "full48", sessionsLeft: 35, totalSessions: 48, status: "paid", phone: "0924-890-1234", email: "isabella@email.com", joinDate: "Jan 2026", lastVisit: "Today", coach: "Coach Maria" },
  { id: 9, name: "David Ramos", avatar: "DR", package: "Staggered 24", packageType: "staggered24", sessionsLeft: 15, totalSessions: 24, status: "paid", phone: "0925-901-2345", email: "david@email.com", joinDate: "Dec 2025", lastVisit: "Yesterday", coach: "Coach Carlos" },
  { id: 10, name: "Patricia Villanueva", avatar: "PV", package: "Personal Training", packageType: "pt", sessionsLeft: 8, totalSessions: 12, status: "paid", phone: "0926-012-3456", email: "patricia@email.com", joinDate: "Feb 2026", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 11, name: "Roberto Aquino", avatar: "RA", package: "Pilates", packageType: "pilates", sessionsLeft: 10, totalSessions: 12, status: "paid", phone: "0927-123-4567", email: "roberto@email.com", joinDate: "Jan 2026", lastVisit: "2 days ago", coach: "Coach Maria" },
  { id: 12, name: "Christine Dela Cruz", avatar: "CD", package: "Full 24", packageType: "full24", sessionsLeft: 5, totalSessions: 24, status: "expiring", phone: "0928-234-5678", email: "christine@email.com", joinDate: "Sep 2025", lastVisit: "3 days ago", coach: "Coach Carlos" },
  { id: 13, name: "Mark Gonzales", avatar: "MG", package: "Staggered 48", packageType: "staggered48", sessionsLeft: 30, totalSessions: 48, status: "paid", phone: "0929-345-6789", email: "mark@email.com", joinDate: "Oct 2025", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 14, name: "Angela Reyes", avatar: "AR", package: "Full 48 Package+", packageType: "full48", sessionsLeft: 42, totalSessions: 48, status: "paid", phone: "0930-456-7890", email: "angela@email.com", joinDate: "Jan 2026", lastVisit: "Yesterday", coach: "Coach Maria" },
  { id: 15, name: "James Pascual", avatar: "JP", package: "Personal Training", packageType: "pt", sessionsLeft: 2, totalSessions: 10, status: "expiring", phone: "0931-567-8901", email: "james@email.com", joinDate: "Nov 2025", lastVisit: "1 week ago", coach: "Coach Carlos" },
  { id: 16, name: "Nicole Bautista", avatar: "NB", package: "Full 24", packageType: "full24", sessionsLeft: 18, totalSessions: 24, status: "paid", phone: "0932-678-9012", email: "nicole@email.com", joinDate: "Dec 2025", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 17, name: "Ryan Santos", avatar: "RS", package: "Pilates", packageType: "pilates", sessionsLeft: 0, totalSessions: 12, status: "unpaid", phone: "0933-789-0123", email: "ryan@email.com", joinDate: "Jul 2025", lastVisit: "1 month ago", coach: "Coach Maria" },
  { id: 18, name: "Jennifer Lopez", avatar: "JL", package: "Staggered 24", packageType: "staggered24", sessionsLeft: 22, totalSessions: 24, status: "paid", phone: "0934-890-1234", email: "jennifer@email.com", joinDate: "Feb 2026", lastVisit: "Today", coach: "Coach Carlos" },
  { id: 19, name: "Kevin Tan", avatar: "KT", package: "Full 48 Package+", packageType: "full48", sessionsLeft: 25, totalSessions: 48, status: "paid", phone: "0935-901-2345", email: "kevin@email.com", joinDate: "Nov 2025", lastVisit: "Yesterday", coach: "Coach Joaquin" },
  { id: 20, name: "Michelle Ong", avatar: "MO", package: "Personal Training", packageType: "pt", sessionsLeft: 6, totalSessions: 8, status: "paid", phone: "0936-012-3456", email: "michelle@email.com", joinDate: "Jan 2026", lastVisit: "Today", coach: "Coach Maria" },
  { id: 21, name: "Dennis Cruz", avatar: "DC", package: "Full 24", packageType: "full24", sessionsLeft: 12, totalSessions: 24, status: "paid", phone: "0937-123-4567", email: "dennis@email.com", joinDate: "Dec 2025", lastVisit: "2 days ago", coach: "Coach Carlos" },
  { id: 22, name: "Grace Lim", avatar: "GL", package: "Staggered 48", packageType: "staggered48", sessionsLeft: 38, totalSessions: 48, status: "paid", phone: "0938-234-5678", email: "grace@email.com", joinDate: "Jan 2026", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 23, name: "Eric Mendoza", avatar: "EM", package: "Pilates", packageType: "pilates", sessionsLeft: 4, totalSessions: 12, status: "paid", phone: "0939-345-6789", email: "eric@email.com", joinDate: "Nov 2025", lastVisit: "Yesterday", coach: "Coach Maria" },
  { id: 24, name: "Diana Castro", avatar: "DCa", package: "Full 48 Package+", packageType: "full48", sessionsLeft: 0, totalSessions: 48, status: "unpaid", phone: "0940-456-7890", email: "diana@email.com", joinDate: "May 2025", lastVisit: "2 weeks ago", coach: "Coach Carlos" },
  { id: 25, name: "Paul Villanueva", avatar: "PVi", package: "Personal Training", packageType: "pt", sessionsLeft: 15, totalSessions: 20, status: "paid", phone: "0941-567-8901", email: "paul@email.com", joinDate: "Feb 2026", lastVisit: "Today", coach: "Coach Joaquin" },
  { id: 26, name: "Linda Rodriguez", avatar: "LR", package: "Staggered 24", packageType: "staggered24", sessionsLeft: 10, totalSessions: 24, status: "paid", phone: "0942-678-9012", email: "linda@email.com", joinDate: "Jan 2026", lastVisit: "Today", coach: "Coach Maria" },
]

// Members data for admin (with more details)
export const membersData = [
  { id: 1, name: "Alex Cruz", avatar: "AC", email: "alex@email.com", phone: "0917-123-4567", package: "Full 48 Package+", status: "active", sessionsLeft: 19, totalPaid: "P47,500", lastPayment: "Jan 15, 2026", nextDue: "Apr 15, 2026", joinDate: "Jan 2025", paymentReminder: false },
  { id: 2, name: "Maria Santos", avatar: "MS", email: "maria@email.com", phone: "0919-345-6789", package: "Personal Training", status: "active", sessionsLeft: 12, totalPaid: "P24,000", lastPayment: "Jan 20, 2026", nextDue: "Feb 20, 2026", joinDate: "Dec 2024", paymentReminder: false },
  { id: 3, name: "John Reyes", avatar: "JR", email: "john@email.com", phone: "0918-234-5678", package: "Staggered 24", status: "active", sessionsLeft: 8, totalPaid: "P9,200", lastPayment: "Feb 1, 2026", nextDue: "Mar 1, 2026", joinDate: "Feb 2025", paymentReminder: false },
  { id: 4, name: "Sofia Garcia", avatar: "SG", email: "sofia@email.com", phone: "0920-456-7890", package: "Full 24", status: "expiring", sessionsLeft: 3, totalPaid: "P25,200", lastPayment: "Nov 15, 2025", nextDue: "Feb 15, 2026", joinDate: "Aug 2024", paymentReminder: true },
  { id: 5, name: "Carlos Mendoza", avatar: "CM", email: "carlos@email.com", phone: "0921-567-8901", package: "Staggered 48", status: "expired", sessionsLeft: 0, totalPaid: "P22,500", lastPayment: "Dec 1, 2025", nextDue: "Jan 1, 2026", joinDate: "Jun 2024", paymentReminder: true },
  { id: 6, name: "Anna Lim", avatar: "AL", email: "anna@email.com", phone: "0922-678-9012", package: "Pilates", status: "active", sessionsLeft: 6, totalPaid: "P12,000", lastPayment: "Jan 25, 2026", nextDue: "Feb 25, 2026", joinDate: "Jan 2026", paymentReminder: false },
  { id: 7, name: "Miguel Torres", avatar: "MT", email: "miguel@email.com", phone: "0923-789-0123", package: "Full 24", status: "active", sessionsLeft: 20, totalPaid: "P25,200", lastPayment: "Feb 1, 2026", nextDue: "May 1, 2026", joinDate: "Nov 2025", paymentReminder: false },
]

// Staff schedule data
export const staffScheduleData = [
  { id: 1, time: "6:00 AM", client: "Maria Santos", session: "Personal Training", status: "done", notes: "Completed leg day workout", phone: "0919-345-6789" },
  { id: 2, time: "8:00 AM", client: "John Reyes", session: "Weights Session", status: "done", notes: "Upper body focus", phone: "0918-234-5678" },
  { id: 3, time: "10:00 AM", client: "Alex Cruz", session: "Cardio Blast", status: "now", notes: "HIIT session in progress", phone: "0917-123-4567" },
  { id: 4, time: "2:00 PM", client: "Sofia Garcia", session: "Personal Training", status: "soon", notes: "Core and flexibility", phone: "0920-456-7890" },
  { id: 5, time: "4:00 PM", client: "Group Class", session: "HIIT Session", status: "soon", notes: "8 members registered", phone: "" },
]

// Next week schedule
export const nextWeekSchedule = [
  { day: "Mon", date: 10, sessions: 5, clients: ["Maria S.", "John R.", "Alex C.", "Sofia G.", "Group"] },
  { day: "Tue", date: 11, sessions: 4, clients: ["Alex C.", "Carlos M.", "Anna L.", "Miguel T."] },
  { day: "Wed", date: 12, sessions: 6, clients: ["Maria S.", "John R.", "Sofia G.", "Group", "Anna L.", "Miguel T."] },
  { day: "Thu", date: 13, sessions: 4, clients: ["Alex C.", "Carlos M.", "Maria S.", "John R."] },
  { day: "Fri", date: 14, sessions: 5, clients: ["Sofia G.", "Group", "Anna L.", "Miguel T.", "Alex C."] },
  { day: "Sat", date: 15, sessions: 3, clients: ["Maria S.", "John R.", "Group"] },
  { day: "Sun", date: 16, sessions: 0, clients: [] },
]

// Monthly calendar data (simplified)
export const monthlyActivities: Record<number, { sessions: number; color: string }> = {
  3: { sessions: 5, color: "bg-primary" },
  4: { sessions: 4, color: "bg-primary/80" },
  5: { sessions: 6, color: "bg-primary" },
  6: { sessions: 4, color: "bg-primary/80" },
  7: { sessions: 5, color: "bg-primary" },
  8: { sessions: 3, color: "bg-primary/60" },
  10: { sessions: 5, color: "bg-primary" },
  11: { sessions: 4, color: "bg-primary/80" },
  12: { sessions: 6, color: "bg-primary" },
  13: { sessions: 4, color: "bg-primary/80" },
  14: { sessions: 5, color: "bg-primary" },
  15: { sessions: 3, color: "bg-primary/60" },
  17: { sessions: 5, color: "bg-primary" },
  18: { sessions: 4, color: "bg-primary/80" },
  19: { sessions: 6, color: "bg-primary" },
  20: { sessions: 4, color: "bg-primary/80" },
  21: { sessions: 5, color: "bg-primary" },
  22: { sessions: 3, color: "bg-primary/60" },
  24: { sessions: 5, color: "bg-primary" },
  25: { sessions: 4, color: "bg-primary/80" },
  26: { sessions: 6, color: "bg-primary" },
  27: { sessions: 4, color: "bg-primary/80" },
  28: { sessions: 5, color: "bg-primary" },
}

// Staff/Coaches data for admin
export const staffData = [
  { 
    id: 1, 
    name: "Coach Joaquin", 
    avatar: "J",
    role: "Personal Trainer", 
    status: "online",
    schedule: [
      { day: "Mon", sessions: 5, hours: "6AM-2PM" },
      { day: "Tue", sessions: 4, hours: "6AM-12PM" },
      { day: "Wed", sessions: 6, hours: "6AM-3PM" },
      { day: "Thu", sessions: 4, hours: "6AM-12PM" },
      { day: "Fri", sessions: 5, hours: "6AM-2PM" },
      { day: "Sat", sessions: 3, hours: "8AM-12PM" },
      { day: "Sun", sessions: 0, hours: "Off" },
    ],
    stats: { day: { sessions: 5, hours: 8 }, week: { sessions: 24, hours: 42 }, month: { sessions: 96, hours: 168 } },
    clients: 18,
    rating: 4.9,
    totalSessions: 24,
    phone: "0917-111-2222",
    email: "joaquin@bearfit.com"
  },
  { 
    id: 2, 
    name: "Coach Maria", 
    avatar: "M",
    role: "Yoga Instructor", 
    status: "online",
    schedule: [
      { day: "Mon", sessions: 4, hours: "8AM-1PM" },
      { day: "Tue", sessions: 5, hours: "8AM-2PM" },
      { day: "Wed", sessions: 4, hours: "8AM-1PM" },
      { day: "Thu", sessions: 5, hours: "8AM-2PM" },
      { day: "Fri", sessions: 2, hours: "8AM-11AM" },
      { day: "Sat", sessions: 4, hours: "9AM-1PM" },
      { day: "Sun", sessions: 0, hours: "Off" },
    ],
    stats: { day: { sessions: 4, hours: 5 }, week: { sessions: 20, hours: 35 }, month: { sessions: 80, hours: 140 } },
    clients: 15,
    rating: 4.8,
    totalSessions: 20,
    phone: "0918-222-3333",
    email: "maria@bearfit.com"
  },
  { 
    id: 3, 
    name: "Coach Carlos", 
    avatar: "C",
    role: "Strength Coach", 
    status: "offline",
    schedule: [
      { day: "Mon", sessions: 3, hours: "2PM-6PM" },
      { day: "Tue", sessions: 4, hours: "2PM-7PM" },
      { day: "Wed", sessions: 3, hours: "2PM-6PM" },
      { day: "Thu", sessions: 4, hours: "2PM-7PM" },
      { day: "Fri", sessions: 4, hours: "2PM-7PM" },
      { day: "Sat", sessions: 2, hours: "1PM-4PM" },
      { day: "Sun", sessions: 0, hours: "Off" },
    ],
    stats: { day: { sessions: 3, hours: 4 }, week: { sessions: 18, hours: 28 }, month: { sessions: 72, hours: 112 } },
    clients: 12,
    rating: 4.7,
    totalSessions: 18,
    phone: "0919-333-4444",
    email: "carlos@bearfit.com"
  },
  { 
    id: 4, 
    name: "Coach Ana", 
    avatar: "A",
    role: "Cardio Specialist", 
    status: "online",
    schedule: [
      { day: "Mon", sessions: 4, hours: "5AM-10AM" },
      { day: "Tue", sessions: 3, hours: "5AM-9AM" },
      { day: "Wed", sessions: 4, hours: "5AM-10AM" },
      { day: "Thu", sessions: 3, hours: "5AM-9AM" },
      { day: "Fri", sessions: 4, hours: "5AM-10AM" },
      { day: "Sat", sessions: 0, hours: "Off" },
      { day: "Sun", sessions: 0, hours: "Off" },
    ],
    stats: { day: { sessions: 4, hours: 5 }, week: { sessions: 15, hours: 25 }, month: { sessions: 60, hours: 100 } },
    clients: 10,
    rating: 4.6,
    totalSessions: 15,
    phone: "0920-444-5555",
    email: "ana@bearfit.com"
  },
]

// Admin transactions data
export const adminTransactions = [
  { id: 1, name: "Alex Cruz", avatar: "AC", amount: "P2,500", type: "Package Renewal", status: "completed", date: "Feb 3, 2026", time: "10:30 AM" },
  { id: 2, name: "Maria Santos", avatar: "MS", amount: "P1,500", type: "PT Session", status: "completed", date: "Feb 3, 2026", time: "9:15 AM" },
  { id: 3, name: "John Reyes", avatar: "JR", amount: "P48,600", type: "Full Package", status: "pending", date: "Feb 2, 2026", time: "4:30 PM" },
  { id: 4, name: "Sofia Garcia", avatar: "SG", amount: "P3,000", type: "Monthly Basic", status: "completed", date: "Feb 2, 2026", time: "2:00 PM" },
  { id: 5, name: "Anna Lim", avatar: "AL", amount: "P47,500", type: "Full Package", status: "completed", date: "Feb 1, 2026", time: "11:00 AM" },
  { id: 6, name: "Miguel Torres", avatar: "MT", amount: "P25,200", type: "Full 24", status: "completed", date: "Feb 1, 2026", time: "9:00 AM" },
]

// Updated Package data with correct details
export const packagesData = [
  { 
    id: 1, 
    name: "Full 24", 
    price: "P25,200", 
    sessions: 24, 
    duration: "90 days", 
    active: 45, 
    description: "24 sessions + 1 free session + 1 hour recovery massage",
    bonuses: ["+1 free session", "1 hour recovery massage"]
  },
  { 
    id: 2, 
    name: "Staggered 24", 
    price: "Staggered", 
    sessions: 24, 
    duration: "90 days", 
    active: 32, 
    description: "24 sessions with staggered payments",
    paymentSchedule: [
      { alert: "19th session remaining", amount: "P9,200" },
      { alert: "13th session remaining", amount: "P8,500" },
      { alert: "1 session remaining", amount: "P7,500" }
    ]
  },
  { 
    id: 3, 
    name: "Full 48", 
    price: "P47,500", 
    sessions: 48, 
    duration: "180 days", 
    active: 35, 
    description: "48 sessions + 2 free sessions + 3 1-hour recovery massage",
    bonuses: ["+2 free sessions", "3x 1-hour recovery massage"]
  },
  { 
    id: 4, 
    name: "Full 48 Package+", 
    price: "P52,500", 
    sessions: 48, 
    duration: "180 days", 
    active: 28, 
    description: "48 sessions + unlimited recovery massage + 1 free PT consultation",
    bonuses: ["+2 free sessions", "Unlimited recovery massage", "1 free PT consultation"]
  },
  { 
    id: 5, 
    name: "Staggered 48", 
    price: "Staggered", 
    sessions: 48, 
    duration: "180 days", 
    active: 28, 
    description: "48 sessions with staggered payments",
    paymentSchedule: [
      { alert: "1st payment", amount: "P22,500" },
      { alert: "9th session", amount: "P25,000" }
    ]
  },
  { 
    id: 6, 
    name: "Personal Training", 
    price: "P1,500/session", 
    sessions: 1, 
    duration: "Per session", 
    active: 20, 
    description: "1-on-1 with certified trainer"
  },
  { 
    id: 7, 
    name: "Pilates", 
    price: "P2,000/session", 
    sessions: 1, 
    duration: "Per session", 
    active: 15, 
    description: "Reformer pilates sessions"
  },
]

// Reports data
export const reportsData = {
  revenue: { daily: "P26,500", weekly: "P185,000", monthly: "P485,000" },
  attendance: { daily: 42, weekly: 294, monthly: 1176 },
  newMembers: { daily: 2, weekly: 12, monthly: 45 },
  renewals: { daily: 3, weekly: 18, monthly: 72 },
}

// Analytics data
export const analyticsData = {
  topPackages: [
    { name: "Full 24", sales: 45, percentage: 35 },
    { name: "Full 48", sales: 35, percentage: 27 },
    { name: "Staggered 24", sales: 32, percentage: 25 },
    { name: "Personal Training", sales: 20, percentage: 16 },
  ],
  peakHours: [
    { time: "6-8 AM", attendance: 35 },
    { time: "8-10 AM", attendance: 28 },
    { time: "10-12 PM", attendance: 15 },
    { time: "4-6 PM", attendance: 42 },
    { time: "6-8 PM", attendance: 38 },
  ],
  memberRetention: 87,
  avgSessionsPerMember: 8.5,
}

// More menu items for Member
export const memberMoreItems = [
  { icon: 'Gift', label: "Referral Program", description: "Earn points by referring friends", id: "referral" },
  { icon: 'HelpCircle', label: "Help & Support", description: "FAQs and contact support", id: "help" },
  { icon: 'Shield', label: "Privacy & Security", description: "Manage your data", id: "privacy" },
  { icon: 'Globe', label: "Language", description: "English", id: "language" },
  { icon: 'Bell', label: "Notifications", description: "Manage alerts", id: "notifications" },
  { icon: 'Info', label: "About BearFit", description: "Version 2.0.1", id: "about" },
]

// More menu items for Staff
export const staffMoreItems = [
  { icon: 'ClipboardList', label: "Session History", description: "View past sessions", id: "sessionHistory" },
  { icon: 'BarChart3', label: "Monthly Report", description: "Download performance report", id: "monthlyReport" },
  { icon: 'Calendar', label: "Time Off Request", description: "Request leave", id: "timeOff" },
  { icon: 'HelpCircle', label: "Help & Support", description: "FAQs and contact", id: "help" },
  { icon: 'Settings', label: "Preferences", description: "App settings", id: "preferences" },
  { icon: 'Info', label: "About BearFit", description: "Version 2.0.1", id: "about" },
]

// Session history data for staff
export const sessionHistoryData = [
  { id: 1, client: "Alex Cruz", session: "Weight Training", date: "Feb 2, 2026", time: "10:00 AM", duration: "60 min", rating: 5 },
  { id: 2, client: "Maria Santos", session: "Personal Training", date: "Feb 2, 2026", time: "6:00 AM", duration: "90 min", rating: 5 },
  { id: 3, client: "John Reyes", session: "HIIT Cardio", date: "Feb 1, 2026", time: "8:00 AM", duration: "45 min", rating: 4 },
  { id: 4, client: "Sofia Garcia", session: "Weight Training", date: "Feb 1, 2026", time: "2:00 PM", duration: "60 min", rating: 5 },
  { id: 5, client: "Group Class", session: "Morning Yoga", date: "Jan 31, 2026", time: "6:00 AM", duration: "60 min", rating: 4 },
]

// Monthly report data
export const monthlyReportData = {
  month: "January 2026",
  totalSessions: 96,
  totalHours: 144,
  avgRating: 4.8,
  topClient: "Alex Cruz",
  mostPopularSession: "Weight Training",
  earnings: "P28,800"
}

// Package filter options
export const packageFilters = ["All", "Full 48", "Full 24", "Staggered 48", "Staggered 24", "Pilates", "PT"]

// Leads data for recruitment
export const leadsData = [
  { id: 1, name: "Marco Dela Rosa", phone: "0917-111-2222", email: "marco@email.com", source: "Referral", status: "hot", interest: "Full 48 Package", lastContact: "Today", nextFollowUp: "Feb 4, 2026", notes: "Very interested, asked about pricing", assignedTo: "Coach Joaquin" },
  { id: 2, name: "Sarah Chen", phone: "0918-222-3333", email: "sarah@email.com", source: "Walk-in", status: "warm", interest: "Personal Training", lastContact: "Yesterday", nextFollowUp: "Feb 5, 2026", notes: "Visited gym, wants to try a session", assignedTo: "Coach Maria" },
  { id: 3, name: "Jerome Tan", phone: "0919-333-4444", email: "jerome@email.com", source: "Social Media", status: "hot", interest: "Pilates", lastContact: "Feb 1, 2026", nextFollowUp: "Feb 3, 2026", notes: "DM inquiry, ready to sign up", assignedTo: "Coach Maria" },
  { id: 4, name: "Andrea Lim", phone: "0920-444-5555", email: "andrea@email.com", source: "Website", status: "cold", interest: "Full 24 Package", lastContact: "Jan 28, 2026", nextFollowUp: "Feb 7, 2026", notes: "Form submission, no response yet", assignedTo: "Coach Carlos" },
  { id: 5, name: "Benjamin Cruz", phone: "0921-555-6666", email: "benjamin@email.com", source: "Referral", status: "warm", interest: "Staggered 48", lastContact: "Jan 30, 2026", nextFollowUp: "Feb 4, 2026", notes: "Referred by Alex Cruz, interested in flex payments", assignedTo: "Coach Joaquin" },
  { id: 6, name: "Christina Reyes", phone: "0922-666-7777", email: "christina@email.com", source: "Event", status: "hot", interest: "Personal Training", lastContact: "Today", nextFollowUp: "Feb 3, 2026", notes: "Met at health fair, wants to start ASAP", assignedTo: "Coach Carlos" },
  { id: 7, name: "Daniel Santos", phone: "0923-777-8888", email: "daniel@email.com", source: "Walk-in", status: "warm", interest: "Full 24 Package", lastContact: "Feb 2, 2026", nextFollowUp: "Feb 5, 2026", notes: "Toured facility, comparing with other gyms", assignedTo: "Coach Joaquin" },
  { id: 8, name: "Emily Pascual", phone: "0924-888-9999", email: "emily@email.com", source: "Social Media", status: "cold", interest: "Pilates", lastContact: "Jan 25, 2026", nextFollowUp: "Feb 6, 2026", notes: "Instagram inquiry, went silent", assignedTo: "Coach Maria" },
  { id: 9, name: "Francis Aquino", phone: "0925-999-0000", email: "francis@email.com", source: "Referral", status: "hot", interest: "Full 48 Package", lastContact: "Today", nextFollowUp: "Feb 4, 2026", notes: "Maria Santos referral, scheduled visit", assignedTo: "Coach Joaquin" },
  { id: 10, name: "Grace Villanueva", phone: "0926-000-1111", email: "grace@email.com", source: "Website", status: "warm", interest: "Staggered 24", lastContact: "Feb 1, 2026", nextFollowUp: "Feb 5, 2026", notes: "Price inquiry, sent brochure", assignedTo: "Coach Carlos" },
  { id: 11, name: "Henry Gonzales", phone: "0927-111-2222", email: "henry@email.com", source: "Walk-in", status: "converted", interest: "Full 24 Package", lastContact: "Feb 3, 2026", nextFollowUp: "-", notes: "Signed up today!", assignedTo: "Coach Joaquin" },
  { id: 12, name: "Irene Mendoza", phone: "0928-222-3333", email: "irene@email.com", source: "Social Media", status: "lost", interest: "Personal Training", lastContact: "Jan 20, 2026", nextFollowUp: "-", notes: "Chose competitor gym", assignedTo: "Coach Maria" },
]

// Leads pipeline stats
export const leadsPipelineStats = {
  total: 12,
  hot: 4,
  warm: 4,
  cold: 2,
  converted: 1,
  lost: 1,
  conversionRate: "8.3%",
  avgTimeToConvert: "12 days"
}

// Branch data for admin tracking
export const branchData = [
  { id: 1, name: "Malingap", address: "Malingap St., Teachers Village, QC", members: 58, revenue: "₱185k", sessionsToday: 8, staff: 4, status: "active", topCoach: "Coach Joaquin", avgRating: 4.9, monthlyGrowth: "+12%", activePackages: 45, pendingPayments: 3, monthlyRevenue: "₱485k", totalClients: 128, newThisMonth: 12, expiringPackages: 8 },
  { id: 2, name: "E.Rod", address: "E. Rodriguez Ave., New Manila, QC", members: 42, revenue: "₱156k", sessionsToday: 4, staff: 3, status: "active", topCoach: "Coach Maria", avgRating: 4.8, monthlyGrowth: "+8%", activePackages: 32, pendingPayments: 5, monthlyRevenue: "₱320k", totalClients: 95, newThisMonth: 8, expiringPackages: 5 },
  { id: 3, name: "Cainta", address: "Ortigas Ave. Extension, Cainta, Rizal", members: 28, revenue: "₱144k", sessionsToday: 2, staff: 2, status: "active", topCoach: "Coach Carlos", avgRating: 4.7, monthlyGrowth: "+15%", activePackages: 22, pendingPayments: 2, monthlyRevenue: "₱245k", totalClients: 65, newThisMonth: 10, expiringPackages: 3 },
]

// Staff attendance data
export const staffAttendanceData: Record<number, { present: boolean; timeIn?: string; timeOut?: string }> = {
  1: { present: true, timeIn: "5:45 AM" },
  2: { present: true, timeIn: "7:30 AM" },
  3: { present: true, timeIn: "1:45 PM" },
  4: { present: false },
  5: { present: true, timeIn: "6:00 AM" },
  6: { present: true, timeIn: "8:00 AM" },
  7: { present: false },
  8: { present: true, timeIn: "2:00 PM" },
  9: { present: false },
  10: { present: true, timeIn: "6:30 AM" },
  11: { present: true, timeIn: "7:00 AM" },
  12: { present: false },
  13: { present: true, timeIn: "5:30 AM" },
  14: { present: true, timeIn: "8:15 AM" },
  15: { present: true, timeIn: "6:45 AM" },
  17: { present: true, timeIn: "6:00 AM" },
  18: { present: true, timeIn: "7:30 AM" },
  19: { present: true, timeIn: "2:00 PM" },
  20: { present: false },
  21: { present: true, timeIn: "6:15 AM" },
  22: { present: true, timeIn: "8:00 AM" },
  24: { present: true, timeIn: "6:00 AM" },
  25: { present: true, timeIn: "7:45 AM" },
  26: { present: true, timeIn: "1:30 PM" },
  27: { present: false },
  28: { present: true, timeIn: "6:30 AM" },
}

// Session time slots for calendar
export const sessionTimeSlots = {
  "6:00 AM": { clients: 3, coach: "Coach Joaquin" },
  "7:00 AM": { clients: 4, coach: "Coach Ana" },
  "8:00 AM": { clients: 5, coach: "Coach Maria" },
  "9:00 AM": { clients: 3, coach: "Coach Joaquin" },
  "10:00 AM": { clients: 4, coach: "Coach Carlos" },
  "11:00 AM": { clients: 2, coach: "Coach Maria" },
  "2:00 PM": { clients: 3, coach: "Coach Carlos" },
  "3:00 PM": { clients: 4, coach: "Coach Joaquin" },
  "4:00 PM": { clients: 5, coach: "Coach Ana" },
  "5:00 PM": { clients: 4, coach: "Coach Maria" },
  "6:00 PM": { clients: 3, coach: "Coach Carlos" },
}
