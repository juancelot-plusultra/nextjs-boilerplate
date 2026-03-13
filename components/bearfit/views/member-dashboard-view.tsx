"use client"

import MemberHomeView from "@/components/bearfit/member/member-home-view"
import MemberScheduleView from "@/components/bearfit/member/member-schedule-view"
import MemberPaymentView from "@/components/bearfit/member/member-payment-view"
import MemberProfileView from "@/components/bearfit/member/member-profile-view"
import MemberMoreView from "@/components/bearfit/member/member-more-view"
import MemberBottomNav from "@/components/bearfit/member/member-bottom-nav"

type Props = {
  activeRole: string
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MemberDashboardView({
  activeRole,
  activeTab,
  setActiveTab,
}: Props) {

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
        return <MemberMoreView />

      default:
        return <MemberHomeView />
    }
  }

  return (
    <div className="pb-20">

      {renderTab()}

      <MemberBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  )
}
