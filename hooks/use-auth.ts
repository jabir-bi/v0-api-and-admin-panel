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
      try {
        console.log("[v0] Checking authentication status...")
        const response = await apiClient.getMe()
        console.log("[v0] Auth check successful:", response.data)
        setUser(response.data || null)
        return response.data
      } catch (error) {
        console.log("[v0] Auth check failed, user not authenticated:", error)
        setUser(null)
        return null
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      console.log("[v0] Attempting login for:", email)
      return apiClient.login(email, password)
    },
    onSuccess: (response) => {
      console.log("[v0] Login successful:", response)
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
      console.log("[v0] Login failed:", error)
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
      console.log("[v0] Attempting logout...")
      return apiClient.logout()
    },
    onSuccess: () => {
      console.log("[v0] Logout successful")
      logoutStore()
      queryClient.clear()
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/login")
    },
    onError: (error: any) => {
      console.log("[v0] Logout failed, clearing local state anyway:", error)
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
