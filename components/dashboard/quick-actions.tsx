"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, Key, Settings, Download, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const router = useRouter()
  const { toast } = useToast()

  const actions = [
    {
      title: "Add User",
      description: "Create a new user account",
      icon: UserPlus,
      action: () => router.push("/dashboard/users"),
      variant: "default" as const,
    },
    {
      title: "Create Role",
      description: "Define a new role",
      icon: Shield,
      action: () => router.push("/dashboard/roles"),
      variant: "secondary" as const,
    },
    {
      title: "Add Permission",
      description: "Create new permission",
      icon: Key,
      action: () => router.push("/dashboard/permissions"),
      variant: "secondary" as const,
    },
    {
      title: "System Settings",
      description: "Configure system",
      icon: Settings,
      action: () => router.push("/dashboard/settings"),
      variant: "outline" as const,
    },
    {
      title: "Export Data",
      description: "Download reports",
      icon: Download,
      action: () => {
        toast({
          title: "Export Started",
          description: "Your data export is being prepared",
        })
      },
      variant: "outline" as const,
    },
    {
      title: "Refresh Cache",
      description: "Clear system cache",
      icon: RefreshCw,
      action: () => {
        toast({
          title: "Cache Cleared",
          description: "System cache has been refreshed",
        })
      },
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={action.action}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">{action.description}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
