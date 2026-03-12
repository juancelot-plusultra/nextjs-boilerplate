"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authLib } from "@/lib/auth"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authLib.getSession()
        
        if (!session) {
          router.push("/login")
          return
        }

        if (session.role !== "admin") {
          router.push(`/${session.role}/dashboard`)
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        console.error("Auth check failed:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <AdminDashboardContent />
}

// Wrapper to redirect to member dashboard with admin role pre-selected via sessionStorage
function AdminDashboardContent() {
  const router = useRouter()
  
  useEffect(() => {
    // Store the intended role in sessionStorage
    sessionStorage.setItem("dashboard_role", "Admin")
    // Redirect to member dashboard
    router.push("/member/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
          <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading Admin Dashboard...</p>
      </div>
    </div>
  )
}
