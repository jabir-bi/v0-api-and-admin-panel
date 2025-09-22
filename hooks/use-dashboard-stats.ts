"use client"

import { useQuery } from "@tanstack/react-query"
import { useUsers } from "./use-users"
import { useRoles } from "./use-roles"
import { usePermissions } from "./use-permissions"

interface DashboardStats {
  totalUsers: number
  totalRoles: number
  totalPermissions: number
  activeSessions: number
  userGrowth: number
  roleGrowth: number
  recentActivity: ActivityItem[]
  roleDistribution: RoleDistribution[]
}

interface ActivityItem {
  id: string
  type: "user_created" | "user_updated" | "role_assigned" | "permission_updated"
  description: string
  user?: string
  timestamp: string
}

interface RoleDistribution {
  name: string
  count: number
  color: string
}

export function useDashboardStats() {
  const { users } = useUsers()
  const { roles } = useRoles()
  const { permissions } = usePermissions()

  return useQuery({
    queryKey: ["dashboard-stats", users.length, roles.length, permissions.length],
    queryFn: (): DashboardStats => {
      // Calculate role distribution
      const roleDistribution: RoleDistribution[] = roles.map((role, index) => {
        const userCount = users.filter((user) => user.roles?.some((r) => r.id === role.id)).length
        const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]
        return {
          name: role.name,
          count: userCount,
          color: colors[index % colors.length],
        }
      })

      // Generate mock recent activity
      const recentActivity: ActivityItem[] = [
        {
          id: "1",
          type: "user_created",
          description: "New user registered",
          user: "john.doe@example.com",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "role_assigned",
          description: "Manager role assigned",
          user: "sarah.wilson@example.com",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "permission_updated",
          description: "Admin role permissions modified",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          type: "user_updated",
          description: "User profile updated",
          user: "mike.johnson@example.com",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ]

      return {
        totalUsers: users.length,
        totalRoles: roles.length,
        totalPermissions: permissions.length,
        activeSessions: Math.floor(Math.random() * 500) + 200, // Mock data
        userGrowth: 20.1,
        roleGrowth: 2,
        recentActivity,
        roleDistribution,
      }
    },
    enabled: users.length > 0 || roles.length > 0 || permissions.length > 0,
  })
}
