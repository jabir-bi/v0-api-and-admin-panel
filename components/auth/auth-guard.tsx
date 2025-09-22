"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function AuthGuard({ children, requiredPermissions = [] }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const userPermissions = user.permissions?.map((p) => p.name) || []
    const rolePermissions = user.roles?.flatMap((r) => r.permissions?.map((p) => p.name) || []) || []
    const allPermissions = [...userPermissions, ...rolePermissions]

    const hasRequiredPermissions = requiredPermissions.every((permission) => allPermissions.includes(permission))

    if (!hasRequiredPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
