"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Permission } from "@/lib/api"
import { usePermissions } from "@/hooks/use-permissions"

const permissionSchema = z.object({
  name: z.string().min(1, "Permission name is required"),
  guard_name: z.string().min(1, "Guard name is required").default("web"),
})

type PermissionFormData = z.infer<typeof permissionSchema>

interface PermissionDialogProps {
  permission?: Permission | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PERMISSION_TEMPLATES = [
  { category: "view", description: "View/Read access" },
  { category: "create", description: "Create/Add new items" },
  { category: "update", description: "Edit/Modify existing items" },
  { category: "delete", description: "Remove/Delete items" },
  { category: "manage", description: "Full management access" },
]

const RESOURCE_TYPES = ["users", "roles", "permissions", "dashboard", "settings", "reports", "logs", "system"]

export function PermissionDialog({ permission, open, onOpenChange }: PermissionDialogProps) {
  const { createPermission, updatePermission, isCreating, isUpdating } = usePermissions()
  const isEditing = !!permission

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
  })

  const watchedName = watch("name")

  useEffect(() => {
    if (open) {
      if (permission) {
        reset({
          name: permission.name,
          guard_name: permission.guard_name,
        })
      } else {
        reset({
          name: "",
          guard_name: "web",
        })
      }
    }
  }, [open, permission, reset])

  const handleTemplateSelect = (category: string, resource: string) => {
    const permissionName = `${category} ${resource}`
    setValue("name", permissionName)
  }

  const onSubmit = async (data: PermissionFormData) => {
    try {
      if (isEditing && permission) {
        await updatePermission({
          id: permission.id,
          name: data.name,
          guard_name: data.guard_name,
        })
      } else {
        await createPermission({
          name: data.name,
          guard_name: data.guard_name,
        })
      }
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Permission" : "Create New Permission"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the permission information below."
              : "Create a new permission. Use the templates below for common permission patterns."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Permission Templates (only for new permissions) */}
          {!isEditing && (
            <div className="space-y-3">
              <Label>Quick Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSION_TEMPLATES.map((template) => (
                  <div key={template.category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize">{template.category}</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {RESOURCE_TYPES.slice(0, 4).map((resource) => (
                        <Button
                          key={`${template.category}-${resource}`}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-transparent"
                          onClick={() => handleTemplateSelect(template.category, resource)}
                        >
                          {template.category} {resource}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Permission Name</Label>
            <Input
              id="name"
              placeholder="e.g., view users, create roles, manage settings"
              {...register("name")}
              disabled={isCreating || isUpdating}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            <p className="text-xs text-muted-foreground">
              Use a clear, descriptive name like "view users" or "manage settings"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guard_name">Guard Name</Label>
            <Select
              value={watch("guard_name")}
              onValueChange={(value) => setValue("guard_name", value)}
              disabled={isCreating || isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select guard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.guard_name && <p className="text-sm text-destructive">{errors.guard_name.message}</p>}
            <p className="text-xs text-muted-foreground">
              Guard defines the authentication context (usually 'web' for web applications)
            </p>
          </div>

          {/* Preview */}
          {watchedName && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-xs text-muted-foreground">Preview</Label>
              <p className="text-sm font-medium">{watchedName}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Permission"
              ) : (
                "Create Permission"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
