import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PermissionTable } from "@/components/permissions/permission-table"
import { RolePermissionMatrix } from "@/components/permissions/role-permission-matrix"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PermissionsPage() {
  return (
    <DashboardLayout
      title="Permission Management"
      description="Manage system permissions and role assignments"
      requiredPermissions={["view permissions"]}
    >
      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="matrix">Role-Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          <PermissionTable />
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <RolePermissionMatrix />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
