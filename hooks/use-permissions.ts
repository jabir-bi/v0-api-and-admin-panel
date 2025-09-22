"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, type Permission } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function usePermissions() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Get all permissions
  const {
    data: permissions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await apiClient.getPermissions()
      return response.data || []
    },
  })

  // Create permission mutation
  const createPermissionMutation = useMutation({
    mutationFn: (permissionData: Partial<Permission>) => apiClient.createPermission(permissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
      toast({
        title: "Success",
        description: "Permission created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create permission",
        variant: "destructive",
      })
    },
  })

  // Update permission mutation
  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, ...permissionData }: { id: number } & Partial<Permission>) =>
      apiClient.updatePermission(id, permissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
      toast({
        title: "Success",
        description: "Permission updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update permission",
        variant: "destructive",
      })
    },
  })

  // Delete permission mutation
  const deletePermissionMutation = useMutation({
    mutationFn: (id: number) => apiClient.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete permission",
        variant: "destructive",
      })
    },
  })

  return {
    permissions: permissions || [],
    isLoading,
    error,
    createPermission: createPermissionMutation.mutate,
    updatePermission: updatePermissionMutation.mutate,
    deletePermission: deletePermissionMutation.mutate,
    isCreating: createPermissionMutation.isPending,
    isUpdating: updatePermissionMutation.isPending,
    isDeleting: deletePermissionMutation.isPending,
  }
}
