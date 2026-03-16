'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Trash2, Edit2, Search, ChevronDown, User, Mail, Phone, Briefcase, Trash, X } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Member {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  branch_id: string
  package_id: string
  status: string
  sessions_left: number
  total_sessions: number
  join_date: string
  total_paid: number
  created_at: string
  updated_at: string
}

export default function UsersManagementPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    branch_id: '',
    package_id: '',
    status: 'active',
    sessions_left: 0,
    total_sessions: 0,
    join_date: new Date().toISOString().split('T')[0],
    total_paid: 0,
  })

  // Fetch members from Supabase
  const fetchMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error: any) {
      console.error('[v0] Error fetching members:', error)
      setMessage('Error loading members: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name || !formData.email) {
      setMessage('Name and email are required')
      return
    }

    try {
      const payload = {
        ...formData,
        user_id: editingId || 'temp-' + Date.now(), // Temporary user_id for demo
      }

      if (editingId) {
        // Update existing member
        const { error } = await supabase
          .from('members')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setMessage('Member updated successfully!')
      } else {
        // Insert new member
        const { error } = await supabase
          .from('members')
          .insert([payload])

        if (error) throw error
        setMessage('Member added successfully!')
      }

      // Reset form and refresh list
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        branch_id: '',
        package_id: '',
        status: 'active',
        sessions_left: 0,
        total_sessions: 0,
        join_date: new Date().toISOString().split('T')[0],
        total_paid: 0,
      })
      setEditingId(null)
      setShowForm(false)
      fetchMembers()

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('[v0] Error saving member:', error)
      setMessage('Error: ' + error.message)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('Member deleted successfully!')
      fetchMembers()
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('[v0] Error deleting member:', error)
      setMessage('Error: ' + error.message)
    }
  }

  // Handle edit
  const handleEdit = (member: Member) => {
    setFormData({
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
      branch_id: member.branch_id,
      package_id: member.package_id,
      status: member.status,
      sessions_left: member.sessions_left,
      total_sessions: member.total_sessions,
      join_date: member.join_date,
      total_paid: member.total_paid,
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  // Filter members by search
  const filteredMembers = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Members Management</h1>
            <p className="text-slate-400">Add, edit, and manage gym members</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                full_name: '',
                email: '',
                phone: '',
                branch_id: '',
                package_id: '',
                status: 'active',
                sessions_left: 0,
                total_sessions: 0,
                join_date: new Date().toISOString().split('T')[0],
                total_paid: 0,
              })
            }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes('Error')
                ? 'bg-red-900/20 border border-red-500/30 text-red-200'
                : 'bg-green-900/20 border border-green-500/30 text-green-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Member' : 'Add New Member'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="+63 912 345 6789"
                />
              </div>

              {/* Branch ID */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Branch ID
                </label>
                <input
                  type="text"
                  value={formData.branch_id}
                  onChange={(e) =>
                    setFormData({ ...formData, branch_id: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="BRH-001"
                />
              </div>

              {/* Package ID */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Package
                </label>
                <select
                  value={formData.package_id}
                  onChange={(e) =>
                    setFormData({ ...formData, package_id: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition"
                >
                  <option value="">Select Package</option>
                  <option value="full24">Full 24</option>
                  <option value="full48">Full 48</option>
                  <option value="staggered24">Staggered 24</option>
                  <option value="staggered48">Staggered 48</option>
                  <option value="pt">Personal Training</option>
                  <option value="pilates">Pilates</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="expiring">Expiring</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Sessions Left */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Sessions Left
                </label>
                <input
                  type="number"
                  value={formData.sessions_left}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sessions_left: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="0"
                />
              </div>

              {/* Total Sessions */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Total Sessions
                </label>
                <input
                  type="number"
                  value={formData.total_sessions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_sessions: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="0"
                />
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={(e) =>
                    setFormData({ ...formData, join_date: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition"
                />
              </div>

              {/* Total Paid */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Total Paid
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total_paid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_paid: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
                  placeholder="0.00"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  {editingId ? 'Update Member' : 'Add Member'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:border-orange-500 outline-none transition"
            />
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Package
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Sessions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      Loading members...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      No members found. Click "Add Member" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <User size={20} className="text-orange-400" />
                          </div>
                          <span className="text-white font-medium">
                            {member.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{member.email}</td>
                      <td className="px-6 py-4 text-slate-300">{member.phone || '-'}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {member.package_id || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            member.status === 'active'
                              ? 'bg-green-900/30 text-green-200'
                              : member.status === 'expiring'
                              ? 'bg-yellow-900/30 text-yellow-200'
                              : 'bg-red-900/30 text-red-200'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {member.sessions_left}/{member.total_sessions}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-orange-400 hover:text-orange-300 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          {!loading && filteredMembers.length > 0 && (
            <div className="bg-slate-700/30 border-t border-slate-700 px-6 py-4">
              <p className="text-sm text-slate-400">
                Showing {filteredMembers.length} of {members.length} members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
