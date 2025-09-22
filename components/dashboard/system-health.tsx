"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Shield, Zap } from "lucide-react"

interface HealthMetric {
  name: string
  value: number
  status: "healthy" | "warning" | "critical"
  icon: React.ComponentType<{ className?: string }>
}

export function SystemHealth() {
  // Mock system health data
  const healthMetrics: HealthMetric[] = [
    {
      name: "API Response Time",
      value: 95,
      status: "healthy",
      icon: Zap,
    },
    {
      name: "Database Performance",
      value: 88,
      status: "healthy",
      icon: Database,
    },
    {
      name: "Authentication Service",
      value: 100,
      status: "healthy",
      icon: Shield,
    },
    {
      name: "Server Resources",
      value: 72,
      status: "warning",
      icon: Server,
    },
  ]

  const getStatusColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusVariant = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "default" as const
      case "warning":
        return "secondary" as const
      case "critical":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2 h-5 w-5" />
          System Health
        </CardTitle>
        <CardDescription>Real-time system performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{metric.value}%</span>
                  <Badge variant={getStatusVariant(metric.status)} className="text-xs">
                    {metric.status}
                  </Badge>
                </div>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
