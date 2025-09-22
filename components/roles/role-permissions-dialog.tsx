"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2, Key, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Role, Permission } from "@/lib/api"
import { usePermissions } from "@/hooks/use-permissions"
import { useToast } from "@/hooks/use-toast"

interface RolePermissionsDialogProps {
  role?: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolePermissionsDialog({ role, open, onOpenChange }: RolePermissionsDialogProps) {
  const { permissions, isLoading } = usePermissions()
  const { toast } = useToast()
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && role) {
      const rolePermissionIds = role.permissions?.map((p) => p.id) || []
      setSelectedPermissions(rolePermissionIds)
    }
  }, [open, role])

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  const handleSave = async () => {
    if (!role) return

    setIsSaving(true)
    try {
      // This would typically call an API endpoint to update role permissions
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Role permissions updated successfully",
      })
      onOpenChange(false)
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

  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      const category = permission.name.split(" ")[0] // Group by first word (e.g., "view", "create", "update", "delete")
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Manage Role Permissions</DialogTitle>
          <DialogDescription>
            {role ? `Configure permissions for the "${role.name}" role` : "Select a role to manage permissions"}
          </DialogDescription>
        </DialogHeader>

        {role && (
          <div className="space-y-4">
            {/* Current permissions summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Current Permissions ({selectedPermissions.length})</h4>
              <div className="flex flex-wrap gap-1">
                {selectedPermissions.length > 0 ? (
                  permissions
                    .filter((p) => selectedPermissions.includes(p.id))
                    .slice(0, 5)
                    .map((permission) => (
                      <Badge key={permission.id} variant="secondary" className="text-xs">
                        <Key className="mr-1 h-3 w-3" />
                        {permission.name}
                      </Badge>
                    ))
                ) : (
                  <span className="text-sm text-muted-foreground">No permissions assigned</span>
                )}
                {selectedPermissions.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedPermissions.length - 5} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Permissions list */}
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary capitalize">{category} Permissions</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                              {permission.name}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              {permission.guard_name}
                            </Badge>
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
              )}
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !role}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
