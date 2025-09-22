"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AuthGuard } from "@/components/auth/auth-guard"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  requiredPermissions?: string[]
}

export function DashboardLayout({ children, title, description, requiredPermissions }: DashboardLayoutProps) {
  return (
    <AuthGuard requiredPermissions={requiredPermissions}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={title} description={description} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
