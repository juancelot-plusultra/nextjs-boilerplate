"use client"

import { useState } from "react"
import { Header, DesktopHeader } from "@/components/bearfit/header"
import { DraggableChatButton } from "@/components/bearfit/draggable-chat-button"
import MemberHomeView from "@/components/bearfit/member/member-home-view"
import MemberScheduleView from "@/components/bearfit/member/member-schedule-view"
import MemberPaymentView from "@/components/bearfit/member/member-payment-view"
import MemberProfileView from "@/components/bearfit/member/member-profile-view"
import MemberMoreView from "@/components/bearfit/member/member-more-view"
import {
  Home,
  Calendar,
  CreditCard,
  User,
  MoreHorizontal,
  MessageCircle,
  X,
  Send,
  Bell,
} from "lucide-react"

type Props = {
  activeRole: string
  activeTab: string
  setActiveTab: (tab: string) => void
}

const memberNavItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Calendar, label: "Schedule", id: "schedule" },
  { icon: CreditCard, label: "Payment", id: "payment" },
  { icon: User, label: "Profile", id: "profile" },
  { icon: MoreHorizontal, label: "More", id: "more" },
]

const chatMessages = [
  { id: 1, sender: "coach", message: "Great job on your workout today!", time: "2:30 PM" },
  { id: 2, sender: "user", message: "Thanks coach! Feeling stronger.", time: "2:32 PM" },
  { id: 3, sender: "coach", message: "Keep it up! See you tomorrow at 6 PM.", time: "2:33 PM" },
]

const notifications = [
  { id: 1, title: "Session Reminder", message: "Weights Session starts in 30 minutes", time: "Just now", unread: true },
  { id: 2, title: "New Year Promo!", message: "Get 20% off on all packages this February", time: "1h ago", unread: true },
  { id: 3, title: "Points Earned", message: "You earned 50 Bearforce Points!", time: "2h ago", unread: true },
  { id: 4, title: "Payment Received", message: "Your payment of ₱2,500 has been confirmed", time: "Yesterday", unread: false },
]

export default function MemberDashboardView({
  activeRole,
  activeTab,
  setActiveTab,
}: Props) {
  const [showChat, setShowChat] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [chatInput, setChatInput] = useState("")

  if (activeRole !== "Member") return null

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return <MemberHomeView />
      case "schedule":
        return <MemberScheduleView />
      case "payment":
        return <MemberPaymentView />
      case "profile":
        return <MemberProfileView />
      case "more":
        return <MemberMoreView onOpenNotifications={() => setShowNotifications(true)} />
      default:
        return <MemberHomeView />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:flex">
        <aside className="w-64 h-screen sticky top-0 bg-[#0d0d0d] border-r border-border/30 flex flex-col">
          <div className="p-5 bg-gradient-to-b from-background/40 via-background/10 to-transparent" />
          <nav className="flex-1 px-3 py-2">
            {memberNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border/30">
            <button
              onClick={() => setShowNotifications(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="font-medium text-sm">Notifications</span>
              <span className="ml-auto w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <button
              onClick={() => setShowChat(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all mt-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Messages</span>
              <span className="ml-auto w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-screen">
          <DesktopHeader
            onOpenChat={() => setShowChat(true)}
            onOpenNotifications={() => setShowNotifications(true)}
            activeRole={"Member"}
            onRoleChange={() => {}}
          />
          <div className="px-6 py-4 max-w-5xl mx-auto">
            {renderTab()}
          </div>
        </main>
      </div>

      <div className="lg:hidden flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="animate-slide-in">
            <Header
              onOpenChat={() => setShowChat(true)}
              onOpenNotifications={() => setShowNotifications(true)}
              activeRole={"Member"}
              onRoleChange={() => {}}
            />
            {renderTab()}
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-border/50 safe-area-bottom z-40">
          <div className="flex justify-around items-center py-2">
            {memberNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all touch-active ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      <DraggableChatButton onClick={() => setShowChat(true)} />

      {showChat && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">CJ</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Coach Joaquin</p>
                  <p className="text-[10px] text-green-500">Online</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-1.5 rounded-full bg-secondary touch-active">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    <p className="text-xs leading-relaxed">{msg.message}</p>
                    <p className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border/50 bg-[#0d0d0d]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="p-2.5 bg-primary rounded-xl touch-active">
                  <Send className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[70vh]">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="text-base font-semibold text-foreground">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="p-1.5 rounded-full bg-secondary touch-active">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-2">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-3 rounded-xl ${notif.unread ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{notif.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{notif.message}</p>
                    </div>
                    {notif.unread && <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
