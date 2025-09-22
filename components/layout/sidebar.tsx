"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Shield, Key, LayoutDashboard, LogOut, Settings, ChevronLeft, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "view dashboard",
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    permission: "view users",
  },
  {
    name: "Roles",
    href: "/dashboard/roles",
    icon: Shield,
    permission: "view roles",
  },
  {
    name: "Permissions",
    href: "/dashboard/permissions",
    icon: Key,
    permission: "view permissions",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    permission: "view settings",
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Get user permissions
  const userPermissions = user?.permissions?.map((p) => p.name) || []
  const rolePermissions = user?.roles?.flatMap((r) => r.permissions?.map((p) => p.name) || []) || []
  const allPermissions = [...userPermissions, ...rolePermissions]

  const hasPermission = (permission: string) => {
    return allPermissions.includes(permission)
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-sidebar-foreground">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            if (!hasPermission(item.permission)) return null

            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    collapsed && "px-2",
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-3 p-2 rounded-md bg-sidebar-accent/50">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => logout()}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground",
            collapsed ? "px-2" : "justify-start",
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  )
}
