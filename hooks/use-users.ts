"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useUsers() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Get all users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.getUsers()
      return response.data || []
    },
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: Partial<User> & { password: string; roles?: string[] }) => apiClient.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Success",
        description: "User created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...userData }: { id: number } & Partial<User>) => apiClient.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      })
    },
  })

  return {
    users: users || [],
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  }
}
