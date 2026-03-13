"use client"

import { useState } from "react"
import {
  ChevronRight,
  Gift,
  HelpCircle,
  Shield,
  Globe,
  Bell,
  Info,
  X,
  CheckCircle,
  Clock,
} from "lucide-react"

type Props = {
  onOpenNotifications?: () => void
}

const memberMoreItems = [
  {
    icon: Gift,
    label: "Referral Program",
    description: "Earn points by referring friends",
    id: "referral",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    description: "FAQs and contact support",
    id: "help",
  },
  {
    icon: Shield,
    label: "Privacy & Security",
    description: "Manage your data",
    id: "privacy",
  },
  {
    icon: Globe,
    label: "Language",
    description: "English",
    id: "language",
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Manage alerts",
    id: "notifications",
  },
  {
    icon: Info,
    label: "About BearFit",
    description: "Version 2.0.1",
    id: "about",
  },
]

export default function MemberMoreView({ onOpenNotifications }: Props) {
  const [showReferral, setShowReferral] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const handleClick = (id: string) => {
    if (id === "referral") setShowReferral(true)
    else if (id === "help") setShowHelp(true)
    else if (id === "privacy") setShowPrivacy(true)
    else if (id === "language") setShowLanguage(true)
    else if (id === "notifications" && onOpenNotifications) onOpenNotifications()
    else if (id === "about") setShowAbout(true)
  }

  return (
    <>
      <div className="px-4 lg:px-0 space-y-2 pb-4">
        {memberMoreItems.map((item, i) => {
          const Icon = item.icon

          return (
            <button
              key={i}
              onClick={() => handleClick(item.id)}
              className="w-full flex items-center justify-between p-3 lg:p-4 bg-[#141414] rounded-xl border border-border/30 touch-active card-press"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs lg:text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[10px] lg:text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
            </button>
          )
        })}
      </div>

      {/* Referral Modal */}
      {showReferral && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-[#141414] z-10">
              <h3 className="text-base font-semibold text-foreground">Referral Program</h3>
              <button
                onClick={() => setShowReferral(false)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-2">Your Referral Code</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-[#0d0d0d] rounded-lg text-sm font-bold text-primary tracking-widest">
                    BEARFIT-JUAN-2026
                  </div>
                  <button className="px-4 py-3 bg-primary text-primary-foreground rounded-lg text-xs font-semibold touch-active">
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-3">Your Referrals</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-[#0d0d0d] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <span className="text-xs text-foreground">Maria Santos</span>
                    </div>
                    <span className="text-xs font-bold text-green-500">+200 MP</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#0d0d0d] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-yellow-500" />
                      </div>
                      <span className="text-xs text-foreground">John Reyes</span>
                    </div>
                    <span className="text-xs text-yellow-500">Pending</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold touch-active">
                Share Referral Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-[#141414] z-10">
              <h3 className="text-base font-semibold text-foreground">Help & Support</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-3">Frequently Asked Questions</p>
                <div className="space-y-2">
                  {[
                    {
                      q: "How do I book a session?",
                      a: "Go to Schedule tab and tap Book Session.",
                    },
                    {
                      q: "How do I earn points?",
                      a: "Complete workouts, refer friends, and join challenges.",
                    },
                    {
                      q: "Can I cancel a booking?",
                      a: "Yes, up to 2 hours before your scheduled session.",
                    },
                    {
                      q: "How do I update my payment method?",
                      a: "Go to Payment tab and manage your payment details there.",
                    },
                  ].map((faq, i) => (
                    <div key={i} className="bg-[#0d0d0d] rounded-lg p-3">
                      <p className="text-xs font-semibold text-foreground">{faq.q}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold touch-active">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-[#141414] z-10">
              <h3 className="text-base font-semibold text-foreground">Privacy & Security</h3>
              <button
                onClick={() => setShowPrivacy(false)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground">Data Protection</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Your account and booking data are protected and only used for BearFit services.
                </p>
              </div>

              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground">Password Security</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Use a strong password and avoid sharing your account access.
                </p>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold touch-active">
                Review Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguage && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-[#141414] z-10">
              <h3 className="text-base font-semibold text-foreground">Language</h3>
              <button
                onClick={() => setShowLanguage(false)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {[
                { code: "en", name: "English", native: "English", selected: true },
                { code: "fil", name: "Filipino", native: "Tagalog", selected: false },
                { code: "es", name: "Spanish", native: "Español", selected: false },
                { code: "zh", name: "Chinese", native: "中文", selected: false },
                { code: "ja", name: "Japanese", native: "日本語", selected: false },
                { code: "ko", name: "Korean", native: "한국어", selected: false },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    alert(`Language changed to ${lang.name}`)
                    setShowLanguage(false)
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl touch-active ${
                    lang.selected
                      ? "bg-primary/20 border border-primary"
                      : "bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className={`w-4 h-4 ${lang.selected ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <p className={`text-xs font-medium ${lang.selected ? "text-primary" : "text-foreground"}`}>
                        {lang.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{lang.native}</p>
                    </div>
                  </div>
                  {lang.selected && <CheckCircle className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] rounded-t-3xl lg:rounded-2xl overflow-hidden border border-border/50 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-[#141414] z-10">
              <h3 className="text-base font-semibold text-foreground">About BearFit</h3>
              <button
                onClick={() => setShowAbout(false)}
                className="p-1.5 rounded-full bg-secondary touch-active"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-bold text-xl">B</span>
                </div>
                <p className="text-lg font-bold text-foreground">BearFit</p>
                <p className="text-xs text-muted-foreground">Version 2.0.1</p>
              </div>

              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  BearFit is your all-in-one fitness companion for training, scheduling,
                  progress tracking, and gym membership management.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
