"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Shield, Info } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoginPending } = useAuth()
  const [error, setError] = useState<string>("")
  const [isMockMode, setIsMockMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    const isDevMode = process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_USE_REAL_API
    setIsMockMode(isDevMode)

    // Pre-fill demo credentials in mock mode
    if (isDevMode) {
      setValue("email", "admin@example.com")
      setValue("password", "password")
    }
  }, [setValue])

  const onSubmit = async (data: LoginFormData) => {
    setError("")
    try {
      login(data)
    } catch (err: any) {
      setError(err.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-4">
        {isMockMode && (
          <Alert variant="warning">
            <Info className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              The API server is not accessible, so the app is running with mock data. Use any email/password to sign in
              and explore the admin panel features.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
            <CardDescription>Sign in to access the role-based access control system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  disabled={isLoginPending}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLoginPending}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              {isMockMode && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: admin@example.com
                  <br />
                  Password: password (or any password)
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoginPending}>
                {isLoginPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
