'use client';

import React, { useEffect, useMemo, useState } from 'react';

/**
 * BearFitPH – Member Dashboard (Home Tab)
 * UI-only, app-first layout
 */

export default function DashboardHomePage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const userName = 'John';
  const greeting =
    now.getHours() < 12
      ? 'Good morning'
      : now.getHours() < 18
      ? 'Good afternoon'
      : 'Good evening';

  const week = useMemo(() => {
    const base = new Date();
    const day = base.getDay() || 7;
    base.setDate(base.getDate() - day + 1);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const todayIdx = week.findIndex(
    d => d.toDateString() === now.toDateString()
  );

  return (
    <div className="min-h-screen bg-[#eef3fb] text-[#0b1220] px-5 py-6 pb-28 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white shadow ring-1 ring-black/5 flex items-center justify-center font-bold">
            JP
          </div>
          <div>
            <div className="text-lg font-semibold">{userName}</div>
            <div className="text-sm text-black/50">{greeting}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="h-11 w-11 rounded-full bg-white shadow ring-1 ring-black/5">
            📅
          </button>
          <button className="h-11 w-11 rounded-full bg-white shadow ring-1 ring-black/5">
            🔔
          </button>
        </div>
      </div>

      {/* Upcoming Session */}
      <div className="rounded-3xl bg-[#0b1220] text-white p-6 space-y-4 shadow-lg">
        <div className="text-sm text-white/70">Upcoming Session</div>
        <div className="text-3xl font-extrabold">Better Form Training</div>
        <div className="flex items-center justify-between text-white/80">
          <div>
            <div>Today • 6:00 PM</div>
            <div className="text-sm">Sikatuna Branch</div>
          </div>
          <button className="rounded-xl bg-[#F37120] px-4 py-2 font-semibold">
            Manage
          </button>
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="flex justify-between gap-2">
        {week.map((d, i) => (
          <div
            key={i}
            className={
              'flex-1 rounded-2xl py-3 text-center ' +
              (i === todayIdx
                ? 'bg-[#F37120] text-white shadow'
                : 'bg-white text-black/60 ring-1 ring-black/10')
            }
          >
            <div className="text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
            </div>
            <div className="text-lg font-bold">{d.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10 space-y-2">
        <div className="text-sm text-black/50">Today's Goal</div>
        <div className="text-2xl font-bold">Weights Training</div>
        <div className="text-black/60">Lower body and core focus</div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          'Book Session',
          'Message Coach',
          'View Progress',
          'Payments',
        ].map(label => (
          <button
            key={label}
            className="rounded-2xl bg-white py-6 font-semibold shadow ring-1 ring-black/10"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions Left', value: '9' },
          { label: 'Balance', value: '₱980' },
          { label: 'Streak', value: '4 days' },
        ].map(x => (
          <div
            key={x.label}
            className="rounded-2xl bg-white p-4 ring-1 ring-black/10 text-center"
          >
            <div className="text-xl font-bold">{x.value}</div>
            <div className="text-xs text-black/50">{x.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
