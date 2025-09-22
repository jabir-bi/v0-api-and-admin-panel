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
import { Loader2 } from "lucide-react"
import type { Role } from "@/lib/api"
import { useRoles } from "@/hooks/use-roles"

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  guard_name: z.string().min(1, "Guard name is required").default("web"),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleDialogProps {
  role?: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleDialog({ role, open, onOpenChange }: RoleDialogProps) {
  const { createRole, updateRole, isCreating, isUpdating } = useRoles()
  const isEditing = !!role

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  })

  useEffect(() => {
    if (open) {
      if (role) {
        reset({
          name: role.name,
          guard_name: role.guard_name,
        })
      } else {
        reset({
          name: "",
          guard_name: "web",
        })
      }
    }
  }, [open, role, reset])

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (isEditing && role) {
        await updateRole({
          id: role.id,
          name: data.name,
          guard_name: data.guard_name,
        })
      } else {
        await createRole({
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the role information below." : "Fill in the details to create a new role."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              placeholder="Enter role name (e.g., Admin, Manager)"
              {...register("name")}
              disabled={isCreating || isUpdating}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guard_name">Guard Name</Label>
            <Input
              id="guard_name"
              placeholder="Enter guard name"
              {...register("guard_name")}
              disabled={isCreating || isUpdating}
            />
            {errors.guard_name && <p className="text-sm text-destructive">{errors.guard_name.message}</p>}
            <p className="text-xs text-muted-foreground">
              Guard name defines the authentication context (usually 'web' for web applications)
            </p>
          </div>

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
                "Update Role"
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
