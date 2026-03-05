import "./globals.css"
import { UserProvider } from "@/lib/context/UserContext"

export const metadata = {
  title: "BearFitPH",
  description: "BearFitPH dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
