"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Key, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Skeleton } from "@/components/ui/skeleton"

export function StatsCards() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.userGrowth}% from last month`,
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Active Roles",
      value: stats.totalRoles.toString(),
      change: `+${stats.roleGrowth} new roles this month`,
      icon: Shield,
      trend: "up" as const,
    },
    {
      title: "Permissions",
      value: stats.totalPermissions.toString(),
      change: "Across all modules",
      icon: Key,
      trend: "neutral" as const,
    },
    {
      title: "Active Sessions",
      value: stats.activeSessions.toLocaleString(),
      change: "+201 since yesterday",
      icon: Activity,
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.trend === "up" ? TrendingUp : card.trend === "down" ? TrendingDown : null

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {TrendIcon && (
                  <TrendIcon
                    className={`mr-1 h-3 w-3 ${
                      card.trend === "up" ? "text-green-500" : card.trend === "down" ? "text-red-500" : ""
                    }`}
                  />
                )}
                {card.change}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
