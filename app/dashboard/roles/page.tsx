import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RoleTable } from "@/components/roles/role-table"

export default function RolesPage() {
  return (
    <DashboardLayout
      title="Role Management"
      description="Manage roles and their associated permissions"
      requiredPermissions={["view roles"]}
    >
      <RoleTable />
    </DashboardLayout>
  )
}
