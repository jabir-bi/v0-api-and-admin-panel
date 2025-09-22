const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://bh.byo-technology.com/api"

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  roles?: Role[]
  permissions?: Permission[]
}

export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  permissions?: Permission[]
}

export interface Permission {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }

  // Auth methods
  async getCsrfCookie(): Promise<void> {
    await fetch(`${this.baseURL.replace("/api", "")}/sanctum/csrf-cookie`, {
      credentials: "include",
    })
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    await this.getCsrfCookie()
    return this.request<User>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<ApiResponse> {
    return this.request("/logout", { method: "POST" })
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>("/me")
  }

  // User methods
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>("/users")
  }

  async createUser(userData: Partial<User> & { password: string; roles?: string[] }): Promise<ApiResponse<User>> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return this.request(`/users/${id}`, { method: "DELETE" })
  }

  // Role methods
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return this.request<Role[]>("/roles")
  }

  async createRole(roleData: Partial<Role>): Promise<ApiResponse<Role>> {
    return this.request<Role>("/roles", {
      method: "POST",
      body: JSON.stringify(roleData),
    })
  }

  async updateRole(id: number, roleData: Partial<Role>): Promise<ApiResponse<Role>> {
    return this.request<Role>(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    })
  }

  async deleteRole(id: number): Promise<ApiResponse> {
    return this.request(`/roles/${id}`, { method: "DELETE" })
  }

  // Permission methods
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    return this.request<Permission[]>("/permissions")
  }

  async createPermission(permissionData: Partial<Permission>): Promise<ApiResponse<Permission>> {
    return this.request<Permission>("/permissions", {
      method: "POST",
      body: JSON.stringify(permissionData),
    })
  }

  async updatePermission(id: number, permissionData: Partial<Permission>): Promise<ApiResponse<Permission>> {
    return this.request<Permission>(`/permissions/${id}`, {
      method: "PUT",
      body: JSON.stringify(permissionData),
    })
  }

  async deletePermission(id: number): Promise<ApiResponse> {
    return this.request(`/permissions/${id}`, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
