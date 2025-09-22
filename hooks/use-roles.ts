"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, type Role } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useRoles() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Get all roles
  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.getRoles()
      return response.data || []
    },
  })

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: (roleData: Partial<Role>) => apiClient.createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast({
        title: "Success",
        description: "Role created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive",
      })
    },
  })

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, ...roleData }: { id: number } & Partial<Role>) => apiClient.updateRole(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast({
        title: "Success",
        description: "Role updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      })
    },
  })

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      })
    },
  })

  return {
    roles: roles || [],
    isLoading,
    error,
    createRole: createRoleMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    deleteRole: deleteRoleMutation.mutate,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
  }
}
