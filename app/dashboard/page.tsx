"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TaskList } from "@/components/task-list"
import { getUser, logout } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive bg-transparent"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <TaskList />
      </div>
    </main>
  )
}
