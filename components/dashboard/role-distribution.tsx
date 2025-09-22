"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield } from "lucide-react"

export function RoleDistribution() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>Current user distribution across roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  const data = stats.roleDistribution.filter((role) => role.count > 0)

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Role Distribution
        </CardTitle>
        <CardDescription>Current user distribution across roles</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No role assignments yet</p>
              <p className="text-sm">Users will appear here once roles are assigned</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
