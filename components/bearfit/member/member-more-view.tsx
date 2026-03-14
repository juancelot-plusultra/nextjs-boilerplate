"use client"

import { useMemo, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Gift,
  HelpCircle,
  Shield,
  Globe,
  Bell,
  Info,
  CheckCircle2,
  Copy,
  Mail,
} from "lucide-react"

type SectionType =
  | null
  | "referral"
  | "help"
  | "privacy"
  | "language"
  | "notifications"
  | "about"

type MemberMoreViewProps = {
  onOpenNotifications?: () => void
}

const memberMoreItems = [
  {
    icon: Gift,
    label: "Referral Program",
    description: "Earn points by referring friends",
    id: "referral" as const,
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    description: "FAQs and contact support",
    id: "help" as const,
  },
  {
    icon: Shield,
    label: "Privacy & Security",
    description: "Manage your data",
    id: "privacy" as const,
  },
  {
    icon: Globe,
    label: "Language",
    description: "English",
    id: "language" as const,
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Manage alerts",
    id: "notifications" as const,
  },
  {
    icon: Info,
    label: "About BearFit",
    description: "Version 2.0.1",
    id: "about" as const,
  },
]

const notificationItems = [
  {
    id: 1,
    title: "Session Reminder",
    message: "Your session with Coach Joaquin starts in 30 minutes.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    title: "Payment Received",
    message: "Your recent payment has been confirmed successfully.",
    time: "2h ago",
    unread: false,
  },
  {
    id: 3,
    title: "Promo Update",
    message: "Get 20% off selected packages this month.",
    time: "Yesterday",
    unread: false,
  },
]

const faqItems = [
  {
    q: "How do I book a session?",
    a: "Go to the Schedule tab and tap Book Session.",
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
    a: "Go to the Payment tab and manage your payment details there.",
  },
]

export default function MemberMoreView({
  onOpenNotifications,
}: MemberMoreViewProps) {
  const [activeSection, setActiveSection] = useState<SectionType>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [copied, setCopied] = useState(false)

  const referralCode = "BEARFIT-2026"

  const items = useMemo(
    () =>
      memberMoreItems.map((item) =>
        item.id === "language"
          ? { ...item, description: selectedLanguage }
          : item
      ),
    [selectedLanguage]
  )

  const handleItemClick = (id: Exclude<SectionType, null>) => {
    if (id === "notifications" && onOpenNotifications) {
      onOpenNotifications()
      return
    }

    setActiveSection((prev) => (prev === id ? null : id))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="px-4 pb-8 lg:px-0">
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon
          const isOpen = activeSection === item.id
          const isExternalNotifications =
            item.id === "notifications" && Boolean(onOpenNotifications)

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-[28px] border border-[#17305b] bg-[#111111]"
            >
              <button
                type="button"
                onClick={() => handleItemClick(item.id)}
                className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-[#151515] md:px-6 md:py-6"
              >
                <div className="flex min-w-0 items-center gap-4 md:gap-5">
                  <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[20px] bg-[#1d2b46] md:h-[68px] md:w-[68px] md:rounded-[22px]">
                    <Icon className="h-7 w-7 text-[#ff7a1a] md:h-8 md:w-8" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[20px] font-semibold text-white md:text-[22px]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[14px] text-[#9eabc0] md:text-[15px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="ml-4 shrink-0">
                  {isExternalNotifications ? (
                    <ChevronRight className="h-7 w-7 text-[#b8c3d9]" />
                  ) : isOpen ? (
                    <ChevronDown className="h-7 w-7 text-white" />
                  ) : (
                    <ChevronRight className="h-7 w-7 text-[#b8c3d9]" />
                  )}
                </div>
              </button>

              {!isExternalNotifications && isOpen && (
                <div className="border-t border-[#17305b] px-5 pb-5 pt-5 md:px-6 md:pb-6 md:pt-6">
                  {item.id === "referral" && (
                    <div className="space-y-4">
                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#9eabc0]">
                          Your Referral Code
                        </p>

                        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                          <div className="flex-1 rounded-[20px] bg-[#111111] px-5 py-4 text-[24px] font-bold tracking-[0.18em] text-[#ff7a1a]">
                            {referralCode}
                          </div>

                          <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[18px] bg-[#ff7a1a] px-5 text-[15px] font-semibold text-white transition hover:opacity-90"
                          >
                            {copied ? (
                              <>
                                <CheckCircle2 className="h-5 w-5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-5 w-5" />
                                Copy Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#9eabc0]">
                          How It Works
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          {[
                            "Share your code with friends",
                            "They sign up and complete registration",
                            "You earn BearFit points automatically",
                          ].map((step) => (
                            <div
                              key={step}
                              className="rounded-[18px] bg-[#111111] px-4 py-4 text-[14px] text-[#d7ddea]"
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.id === "help" && (
                    <div className="space-y-4">
                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#9eabc0]">
                          Frequently Asked Questions
                        </p>

                        <div className="mt-4 space-y-3">
                          {faqItems.map((faq) => (
                            <div
                              key={faq.q}
                              className="rounded-[20px] bg-[#111111] px-5 py-5"
                            >
                              <p className="text-[18px] font-semibold text-white">
                                {faq.q}
                              </p>
                              <p className="mt-2 text-[15px] leading-7 text-[#aeb8cb]">
                                {faq.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#9eabc0]">
                          Need More Help?
                        </p>
                        <p className="mt-3 text-[15px] leading-7 text-[#d7ddea]">
                          Reach out to our support team for account concerns,
                          bookings, payments, or technical issues.
                        </p>

                        <a
                          href="mailto:support@bearfit.com?subject=BearFit Support Request"
                          className="mt-5 inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#ff7a1a] px-5 text-[16px] font-semibold text-white transition hover:opacity-90 md:w-auto"
                        >
                          <Mail className="h-5 w-5" />
                          Contact Support
                        </a>
                      </div>
                    </div>
                  )}

                  {item.id === "privacy" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#9eabc0]">
                          Data Protection
                        </p>
                        <p className="mt-3 text-[15px] leading-7 text-[#d7ddea]">
                          Your account details, bookings, and payments are used
                          only for BearFit services and membership management.
                        </p>
                      </div>

                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[14px] font-medium uppercase tracking-[0.14em] text-[#9eabc0]">
                          Account Security
                        </p>
                        <p className="mt-3 text-[15px] leading-7 text-[#d7ddea]">
                          Use a strong password, keep your login private, and
                          avoid sharing your account with others.
                        </p>
                      </div>
                    </div>
                  )}

                  {item.id === "language" && (
                    <div className="rounded-[24px] bg-[#1d2b46] p-4 md:p-5">
                      <div className="grid gap-3 md:grid-cols-2">
                        {[
                          "English",
                          "Filipino",
                          "Spanish",
                          "Japanese",
                          "Korean",
                        ].map((lang) => {
                          const isSelected = selectedLanguage === lang

                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setSelectedLanguage(lang)}
                              className={`flex items-center justify-between rounded-[20px] px-5 py-4 text-left transition ${
                                isSelected
                                  ? "border border-[#ff7a1a] bg-[#111111]"
                                  : "bg-[#111111] hover:border hover:border-[#26467a]"
                              }`}
                            >
                              <span
                                className={`text-[16px] font-medium ${
                                  isSelected ? "text-white" : "text-[#c2cbda]"
                                }`}
                              >
                                {lang}
                              </span>

                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-[#ff7a1a]" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {item.id === "notifications" && (
                    <div className="space-y-3">
                      {notificationItems.map((notification) => (
                        <div
                          key={notification.id}
                          className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[18px] font-semibold text-white">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff7a1a]" />
                                )}
                              </div>
                              <p className="mt-2 text-[15px] leading-7 text-[#c2cbda]">
                                {notification.message}
                              </p>
                              <p className="mt-3 text-[13px] text-[#9eabc0]">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.id === "about" && (
                    <div className="space-y-4">
                      <div className="rounded-[24px] bg-[#1d2b46] p-6 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#ff7a1a] text-[28px] font-bold text-white">
                          B
                        </div>
                        <p className="mt-4 text-[28px] font-bold text-white">
                          BearFit
                        </p>
                        <p className="mt-1 text-[14px] text-[#9eabc0]">
                          Version 2.0.1
                        </p>
                      </div>

                      <div className="rounded-[24px] bg-[#1d2b46] p-5 md:p-6">
                        <p className="text-[15px] leading-7 text-[#d7ddea]">
                          BearFit is your all-in-one fitness companion for
                          training, scheduling, progress tracking, payments, and
                          membership management.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
