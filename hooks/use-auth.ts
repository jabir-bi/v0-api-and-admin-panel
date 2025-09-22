"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function useAuth() {
  const { user, isAuthenticated, setUser, setLoading, logout: logoutStore } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { toast } = useToast()

  // Check authentication status
  const { isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await apiClient.getMe()
      setUser(response.data || null)
      return response.data
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return apiClient.login(email, password)
    },
    onSuccess: (response) => {
      if (response.data) {
        setUser(response.data)
        queryClient.setQueryData(["auth", "me"], response.data)
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
        router.push("/dashboard")
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      return apiClient.logout()
    },
    onSuccess: () => {
      logoutStore()
      queryClient.clear()
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/login")
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local state
      logoutStore()
      queryClient.clear()
      router.push("/login")
    },
  })

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  }
}
