"use client"

import { useState } from "react"
import { HelpCircle, ChevronRight } from "lucide-react"

type Props = {
  onOpenNotifications?: () => void
}

export default function MemberMoreView({ onOpenNotifications }: Props) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <div className="px-4">
        <button
          onClick={() => setShowHelp(true)}
          className="w-full flex items-center justify-between p-4 bg-[#141414] rounded-xl border border-border/30"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-semibold">Help & Support</p>
              <p className="text-xs text-muted-foreground">FAQs and contact support</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onOpenNotifications?.()}
          className="w-full mt-2 flex items-center justify-between p-4 bg-[#141414] rounded-xl border border-border/30"
        >
          <div className="text-left">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">Open your alerts</p>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-[#141414] p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Help & Support</h3>

            <div className="space-y-2">
              <div className="bg-black p-3 rounded-lg">
                <p className="font-semibold text-sm">How do I book a session?</p>
                <p className="text-xs text-muted-foreground">
                  Go to Schedule tab and tap Book Session.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = "mailto:support@bearfit.com"
              }}
              className="w-full mt-4 py-3 bg-primary text-white rounded-xl"
            >
              Contact Support
            </button>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-2 py-3 border border-border text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
