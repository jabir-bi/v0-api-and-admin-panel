"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Search, Save, Shield, Key } from "lucide-react"
import { useRoles } from "@/hooks/use-roles"
import { usePermissions } from "@/hooks/use-permissions"
import { useToast } from "@/hooks/use-toast"

export function RolePermissionMatrix() {
  const { roles, isLoading: rolesLoading } = useRoles()
  const { permissions, isLoading: permissionsLoading } = usePermissions()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [changes, setChanges] = useState<Record<string, boolean>>({})

  const isLoading = rolesLoading || permissionsLoading

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      const category = permission.name.split(" ")[0]
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  const hasPermission = (roleId: number, permissionId: number) => {
    const changeKey = `${roleId}-${permissionId}`
    if (changeKey in changes) {
      return changes[changeKey]
    }
    const role = roles.find((r) => r.id === roleId)
    return role?.permissions?.some((p) => p.id === permissionId) || false
  }

  const togglePermission = (roleId: number, permissionId: number) => {
    const changeKey = `${roleId}-${permissionId}`
    const currentValue = hasPermission(roleId, permissionId)
    setChanges((prev) => ({
      ...prev,
      [changeKey]: !currentValue,
    }))
  }

  const saveChanges = async () => {
    setIsSaving(true)
    try {
      // This would typically make API calls to update role permissions
      // For now, we'll just simulate the save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Role permissions updated successfully",
      })
      setChanges({})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role permissions",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = Object.keys(changes).length > 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role-Permission Matrix</CardTitle>
          <CardDescription>Loading role and permission data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Role-Permission Matrix
            </CardTitle>
            <CardDescription>
              Manage permissions for all roles in a single view. Changes are highlighted and can be saved in bulk.
            </CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={saveChanges} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes ({Object.keys(changes).length})
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Matrix */}
        <div className="border rounded-lg">
          <ScrollArea className="h-[600px]">
            <div className="p-4">
              {/* Header with role names */}
              <div
                className="grid gap-4 mb-4"
                style={{ gridTemplateColumns: "200px repeat(auto-fit, minmax(120px, 1fr))" }}
              >
                <div className="font-semibold">Permission</div>
                {roles.map((role) => (
                  <div key={role.id} className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      {role.name}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Permission rows grouped by category */}
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-3 capitalize flex items-center">
                    <Key className="mr-2 h-4 w-4" />
                    {category} Permissions
                  </h3>
                  <div className="space-y-2">
                    {categoryPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="grid gap-4 items-center py-2 px-3 rounded-md hover:bg-muted/50"
                        style={{ gridTemplateColumns: "200px repeat(auto-fit, minmax(120px, 1fr))" }}
                      >
                        <div className="text-sm font-medium">{permission.name}</div>
                        {roles.map((role) => {
                          const changeKey = `${role.id}-${permission.id}`
                          const isChecked = hasPermission(role.id, permission.id)
                          const hasChange = changeKey in changes

                          return (
                            <div key={role.id} className="flex justify-center">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => togglePermission(role.id, permission.id)}
                                className={hasChange ? "border-primary" : ""}
                              />
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(groupedPermissions).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {searchTerm ? "No permissions found matching your search." : "No permissions available."}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Checkbox checked disabled />
            <span>Permission granted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Checkbox disabled />
            <span>Permission not granted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Checkbox className="border-primary" disabled />
            <span>Pending changes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
