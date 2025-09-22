const API_BASE_URL = "http://bh.byo-technology.com/api"

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
  private useMockData = false

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.useMockData = process.env.NODE_ENV === "development"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    if (this.useMockData) {
      return this.getMockResponse<T>(endpoint, options)
    }

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

    try {
      console.log("[v0] Making API request to:", url)
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 0 || !response.type) {
          console.log("[v0] Network error detected, switching to mock data")
          this.useMockData = true
          return this.getMockResponse<T>(endpoint, options)
        }

        const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] API response:", data)
      return data
    } catch (error) {
      console.log("[v0] API Error, falling back to mock data:", error)

      if (process.env.NODE_ENV === "development") {
        this.useMockData = true
        return this.getMockResponse<T>(endpoint, options)
      }

      throw error
    }
  }

  private async getMockResponse<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log("[v0] Using mock data for endpoint:", endpoint)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const method = options.method || "GET"

    // Mock user data
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      email_verified_at: "2024-01-01T00:00:00.000000Z",
      created_at: "2024-01-01T00:00:00.000000Z",
      updated_at: "2024-01-01T00:00:00.000000Z",
      roles: [
        {
          id: 1,
          name: "Super Admin",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
      ],
      permissions: [
        {
          id: 1,
          name: "users.view",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 2,
          name: "users.create",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 3,
          name: "users.edit",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 4,
          name: "users.delete",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 5,
          name: "roles.view",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 6,
          name: "roles.create",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 7,
          name: "roles.edit",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 8,
          name: "roles.delete",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 9,
          name: "permissions.view",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 10,
          name: "permissions.create",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 11,
          name: "permissions.edit",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
        {
          id: 12,
          name: "permissions.delete",
          guard_name: "web",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z",
        },
      ],
    }

    const mockUsers = [
      mockUser,
      {
        id: 2,
        name: "John Doe",
        email: "john@example.com",
        email_verified_at: "2024-01-02T00:00:00.000000Z",
        created_at: "2024-01-02T00:00:00.000000Z",
        updated_at: "2024-01-02T00:00:00.000000Z",
        roles: [
          {
            id: 2,
            name: "Editor",
            guard_name: "web",
            created_at: "2024-01-01T00:00:00.000000Z",
            updated_at: "2024-01-01T00:00:00.000000Z",
          },
        ],
      },
      {
        id: 3,
        name: "Jane Smith",
        email: "jane@example.com",
        email_verified_at: "2024-01-03T00:00:00.000000Z",
        created_at: "2024-01-03T00:00:00.000000Z",
        updated_at: "2024-01-03T00:00:00.000000Z",
        roles: [
          {
            id: 3,
            name: "Viewer",
            guard_name: "web",
            created_at: "2024-01-01T00:00:00.000000Z",
            updated_at: "2024-01-01T00:00:00.000000Z",
          },
        ],
      },
    ]

    const mockRoles = [
      {
        id: 1,
        name: "Super Admin",
        guard_name: "web",
        created_at: "2024-01-01T00:00:00.000000Z",
        updated_at: "2024-01-01T00:00:00.000000Z",
        permissions: mockUser.permissions,
      },
      {
        id: 2,
        name: "Editor",
        guard_name: "web",
        created_at: "2024-01-01T00:00:00.000000Z",
        updated_at: "2024-01-01T00:00:00.000000Z",
        permissions: mockUser.permissions.slice(0, 6),
      },
      {
        id: 3,
        name: "Viewer",
        guard_name: "web",
        created_at: "2024-01-01T00:00:00.000000Z",
        updated_at: "2024-01-01T00:00:00.000000Z",
        permissions: [mockUser.permissions[0], mockUser.permissions[4], mockUser.permissions[8]],
      },
    ]

    // Route mock responses
    if (endpoint === "/me") {
      return { data: mockUser as T }
    }

    if (endpoint === "/login" && method === "POST") {
      return { data: mockUser as T, message: "Login successful" }
    }

    if (endpoint === "/logout" && method === "POST") {
      return { message: "Logout successful" } as ApiResponse<T>
    }

    if (endpoint === "/users") {
      return { data: mockUsers as T }
    }

    if (endpoint === "/roles") {
      return { data: mockRoles as T }
    }

    if (endpoint === "/permissions") {
      return { data: mockUser.permissions as T }
    }

    // Default success response
    return { message: "Mock operation successful" } as ApiResponse<T>
  }

  // Auth methods
  async getCsrfCookie(): Promise<void> {
    if (this.useMockData) {
      console.log("[v0] Mock CSRF cookie request")
      return
    }

    try {
      await fetch(`${this.baseURL.replace("/api", "")}/sanctum/csrf-cookie`, {
        credentials: "include",
      })
    } catch (error) {
      console.log("[v0] CSRF cookie request failed, switching to mock data")
      this.useMockData = true
    }
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
