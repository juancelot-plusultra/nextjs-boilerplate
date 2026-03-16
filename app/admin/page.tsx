'use client'

import Link from 'next/link'
import { Users, Settings, BarChart3, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const menuItems = [
    {
      title: 'Members Management',
      description: 'Add, edit, and manage gym members with Supabase integration',
      icon: Users,
      href: '/admin/users',
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: 'Analytics',
      description: 'View member statistics and activity reports',
      icon: BarChart3,
      href: '#',
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: 'Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      href: '#',
      color: 'from-green-600 to-green-400',
    },
    {
      title: 'Reports',
      description: 'Generate and download detailed reports',
      icon: FileText,
      href: '#',
      color: 'from-orange-600 to-orange-400',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-400">
            Manage your gym operations and members with Supabase integration
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className={item.href === '#' ? 'pointer-events-none opacity-50' : ''}
              >
                <div className="group h-full bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition cursor-pointer hover:shadow-lg hover:shadow-slate-900/50">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">Total Members</p>
              <p className="text-3xl font-bold text-white">-</p>
              <p className="text-xs text-slate-500 mt-2">Synced with Supabase</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">Active Sessions</p>
              <p className="text-3xl font-bold text-white">-</p>
              <p className="text-xs text-slate-500 mt-2">This week</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">Revenue</p>
              <p className="text-3xl font-bold text-white">-</p>
              <p className="text-xs text-slate-500 mt-2">This month</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">Staff Members</p>
              <p className="text-3xl font-bold text-white">-</p>
              <p className="text-xs text-slate-500 mt-2">Active coaches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
