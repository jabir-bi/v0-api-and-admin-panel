import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserTable } from "@/components/users/user-table"

export default function UsersPage() {
  return (
    <DashboardLayout
      title="User Management"
      description="Manage users, their roles, and permissions"
      requiredPermissions={["view users"]}
    >
      <UserTable />
    </DashboardLayout>
  )
}
