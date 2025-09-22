import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { RoleDistribution } from "@/components/dashboard/role-distribution"
import { SystemHealth } from "@/components/dashboard/system-health"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" description="Overview of your role-based access control system">
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentActivity />
          <RoleDistribution />
        </div>

        {/* Secondary Content Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <SystemHealth />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  )
}
