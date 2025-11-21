export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict"
  }
}
