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
} from "lucide-react"

type ModalType =
  | null
  | "referral"
  | "help"
  | "privacy"
  | "language"
  | "notifications"
  | "about"

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

const notifications = [
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

export default function MemberMoreView() {
  const [openModal, setOpenModal] = useState<ModalType>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const closeModal = () => setOpenModal(null)

  return (
    <>
      <div className="px-4 lg:px-0 space-y-4 pb-6">
        {memberMoreItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => setOpenModal(item.id)}
              className="w-full flex items-center justify-between rounded-[28px] border border-[#17305b] bg-[#111111] px-6 py-7 text-left transition hover:border-[#26467a]"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-[#1d2b46]">
                  <Icon className="h-8 w-8 text-[#ff7a1a]" />
                </div>

                <div>
                  <p className="text-[18px] font-semibold text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[14px] text-[#9eabc0]">
                    {item.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-7 w-7 text-[#b8c3d9]" />
            </button>
          )
        })}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-3xl rounded-[30px] border border-[#17305b] bg-[#111111] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#17305b] px-8 py-7">
              <h3 className="text-[28px] font-bold text-white">
                {openModal === "referral" && "Referral Program"}
                {openModal === "help" && "Help & Support"}
                {openModal === "privacy" && "Privacy & Security"}
                {openModal === "language" && "Language"}
                {openModal === "notifications" && "Notifications"}
                {openModal === "about" && "About BearFit"}
              </h3>

              <button
                onClick={closeModal}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1d2b46]"
              >
                <X className="h-8 w-8 text-[#a9b6cb]" />
              </button>
            </div>

            <div className="px-8 py-8">
              {openModal === "referral" && (
                <div className="space-y-6">
                  <div className="rounded-[24px] bg-[#1d2b46] p-8">
                    <p className="text-[16px] font-semibold text-white">
                      Your Referral Code
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="rounded-[16px] bg-black px-5 py-4 text-[20px] font-bold tracking-[0.2em] text-[#ff7a1a]">
                        BEARFIT-2026
                      </div>
                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText("BEARFIT-2026")
                        }
                        className="rounded-[16px] bg-[#ff7a1a] px-5 py-4 text-[15px] font-semibold text-white"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#1d2b46] p-8">
                    <p className="text-[16px] font-semibold text-white">
                      How it works
                    </p>
                    <div className="mt-4 space-y-3 text-[15px] text-[#c2cbda]">
                      <p>• Share your referral code with friends</p>
                      <p>• Friend signs up and completes registration</p>
                      <p>• You earn BearFit points automatically</p>
                    </div>
                  </div>
                </div>
              )}

              {openModal === "help" && (
                <div className="space-y-6">
                  <div className="rounded-[24px] bg-[#1d2b46] p-8">
                    <p className="mb-5 text-[16px] font-semibold text-white">
                      Frequently Asked Questions
                    </p>

                    <div className="space-y-4">
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
                        <div key={i} className="rounded-[20px] bg-black p-6">
                          <p className="text-[16px] font-semibold text-white">
                            {faq.q}
                          </p>
                          <p className="mt-2 text-[14px] text-[#9eabc0]">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.location.href =
                        "mailto:support@bearfit.com?subject=BearFit Support Request"
                    }}
                    className="w-full rounded-[22px] bg-[#ff7a1a] py-6 text-[18px] font-semibold text-white"
                  >
                    Contact Support
                  </button>
                </div>
              )}

              {openModal === "privacy" && (
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-[#1d2b46] p-8">
                    <p className="text-[16px] font-semibold text-white">
                      Data Protection
                    </p>
                    <p className="mt-3 text-[14px] text-[#c2cbda]">
                      Your account details, bookings, and payments are only used
                      for BearFit services.
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#1d2b46] p-8">
                    <p className="text-[16px] font-semibold text-white">
                      Account Security
                    </p>
                    <p className="mt-3 text-[14px] text-[#c2cbda]">
                      Use a strong password and do not share your login with
                      others.
                    </p>
                  </div>
                </div>
              )}

              {openModal === "language" && (
                <div className="space-y-3">
                  {["English", "Filipino", "Spanish", "Japanese", "Korean"].map(
                    (lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang)
                          closeModal()
                        }}
                        className={`flex w-full items-center justify-between rounded-[20px] p-5 ${
                          selectedLanguage === lang
                            ? "border border-[#ff7a1a] bg-[#1d2b46]"
                            : "bg-[#1d2b46]"
                        }`}
                      >
                        <span
                          className={`text-[16px] font-medium ${
                            selectedLanguage === lang
                              ? "text-[#ff7a1a]"
                              : "text-white"
                          }`}
                        >
                          {lang}
                        </span>
                        {selectedLanguage === lang && (
                          <CheckCircle className="h-5 w-5 text-[#ff7a1a]" />
                        )}
                      </button>
                    )
                  )}
                </div>
              )}

              {openModal === "notifications" && (
                <div className="space-y-4">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[20px] bg-[#1d2b46] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[16px] font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-[14px] text-[#c2cbda]">
                            {item.message}
                          </p>
                          <p className="mt-3 text-[12px] text-[#9eabc0]">
                            {item.time}
                          </p>
                        </div>
                        {item.unread && (
                          <span className="mt-1 inline-block h-3 w-3 rounded-full bg-[#ff7a1a]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {openModal === "about" && (
                <div className="space-y-6">
                  <div className="py-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#ff7a1a] text-[28px] font-bold text-white">
                      B
                    </div>
                    <p className="mt-4 text-[24px] font-bold text-white">
                      BearFit
                    </p>
                    <p className="text-[14px] text-[#9eabc0]">Version 2.0.1</p>
                  </div>

                  <div className="rounded-[24px] bg-[#1d2b46] p-8">
                    <p className="text-[15px] leading-7 text-[#c2cbda]">
                      BearFit is your all-in-one fitness companion for training,
                      scheduling, progress tracking, and membership management.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
