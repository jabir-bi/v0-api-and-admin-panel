"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, UserCheck, Shield, Settings, Clock } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Skeleton } from "@/components/ui/skeleton"

const activityIcons = {
  user_created: UserPlus,
  user_updated: UserCheck,
  role_assigned: Shield,
  permission_updated: Settings,
}

const activityColors = {
  user_created: "bg-green-500",
  user_updated: "bg-blue-500",
  role_assigned: "bg-purple-500",
  permission_updated: "bg-orange-500",
}

function formatTimeAgo(timestamp: string) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export function RecentActivity() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest user and role management activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest user and role management activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => {
              const Icon = activityIcons[activity.type]
              const colorClass = activityColors[activity.type]

              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.description}</p>
                    {activity.user && <p className="text-sm text-muted-foreground">{activity.user}</p>}
                  </div>
                  <div className="text-sm text-muted-foreground">{formatTimeAgo(activity.timestamp)}</div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
