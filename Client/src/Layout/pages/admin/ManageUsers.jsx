"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Shield, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getEnv } from "@/helpers/getEnv"
import { TableSkeleton } from "@/components/TableSkeleton"

const ManageUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/user/all`, {
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                setUsers(data.users)
            } else {
                toast.error(data.message || "Unauthorized access")
            }
        } catch (error) {
            toast.error("Failed to connect to the server")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/user/delete/${id}`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
                setUsers(users.filter(u => u._id !== id))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Error deleting user")
        }
    }

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin'
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/user/update-role/${user._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
                setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u))
            }
        } catch (error) {
            toast.error("Error updating role")
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Shield className="h-6 w-6 text-primary" strokeWidth={2.5} />
                        </div>
                        Manage Users
                    </h2>
                    <p className="text-muted-foreground text-md font-medium">
                        Control user access levels and maintain community standards.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b bg-muted/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            User Directory
                            <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 text-[10px] font-bold">
                                {users.length} TOTAL
                            </Badge>
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20 hover:bg-muted/20 border-b transition-none">
                                    <TableHead className="w-[80px] font-bold text-foreground pl-6 py-4">Avatar</TableHead>
                                    <TableHead className="font-bold text-foreground py-4">Name & Email</TableHead>
                                    <TableHead className="font-bold text-foreground py-4">Role</TableHead>
                                    <TableHead className="font-bold text-foreground py-4">Joined Date</TableHead>
                                    <TableHead className="text-right font-bold text-foreground pr-6 py-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton columns={5} rows={5} />
                                ) : users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user._id} className="group hover:bg-muted/30 transition-colors border-b last:border-0 border-border/40">
                                            <TableCell className="pl-6 py-4">
                                                <Avatar className="h-10 w-10 border-2 border-background ring-2 ring-muted group-hover:ring-primary/20 transition-all duration-300">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground tracking-tight">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge
                                                    variant={user.role === 'admin' ? "default" : "secondary"}
                                                    className={`rounded-lg px-2.5 py-0.5 text-[11px] font-black tracking-wide uppercase ${user.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' : ''}`}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 truncate text-sm font-medium text-muted-foreground/80">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                                                        onClick={() => toggleRole(user)}
                                                        className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ManageUsers
