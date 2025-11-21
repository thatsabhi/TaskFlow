import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">TaskFlow</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </div>
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
