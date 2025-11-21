import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">TaskFlow</h1>
          <p className="text-xl text-muted-foreground">
            Your complete platform to manage tasks, collaborate, and scale your workflow
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Fast & Reliable</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Built with modern tech for seamless performance
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Secure Auth</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              JWT-based authentication with password hashing
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scalable API</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">RESTful backend ready for growth</CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
