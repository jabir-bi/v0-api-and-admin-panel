"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Key, Search, Plus } from "lucide-react"
import type { Permission } from "@/lib/api"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionDialog } from "./permission-dialog"
import { DeletePermissionDialog } from "./delete-permission-dialog"

export function PermissionTable() {
  const { permissions, isLoading, deletePermission } = usePermissions()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Permission Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <Key className="mr-2 h-4 w-4 text-accent" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "guard_name",
      header: "Guard",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.getValue("guard_name")}
        </Badge>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => {
        const permissionName = row.getValue("name") as string
        const category = permissionName.split(" ")[0] // Extract category from permission name
        return (
          <Badge variant="outline" className="text-xs capitalize">
            {category}
          </Badge>
        )
      },
    },
    {
      id: "usage",
      header: "Used By Roles",
      cell: ({ row }) => {
        // This would typically come from the API with role count
        // For now, we'll show a placeholder
        return (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">3</span> roles
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const permission = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(permission.name)}>
                Copy permission name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPermission(permission)
                  setIsPermissionDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit permission
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setPermissionToDelete(permission)
                  setIsDeleteDialogOpen(true)
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete permission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: permissions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Group permissions by category for better organization
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      const category = permission.name.split(" ")[0]
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Permission Categories Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
          <div key={category} className="p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium capitalize">{category} Permissions</h3>
                <p className="text-2xl font-bold">{categoryPermissions.length}</p>
              </div>
              <Key className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter permissions..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="pl-8 max-w-sm"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedPermission(null)
            setIsPermissionDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No permissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <PermissionDialog
        permission={selectedPermission}
        open={isPermissionDialogOpen}
        onOpenChange={setIsPermissionDialogOpen}
      />
      <DeletePermissionDialog
        permission={permissionToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          if (permissionToDelete) {
            deletePermission(permissionToDelete.id)
            setIsDeleteDialogOpen(false)
            setPermissionToDelete(null)
          }
        }}
      />
    </div>
  )
}
