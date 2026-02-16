"use client"

import { useEffect, useState } from "react"
import { Edit, Plus, Trash2, FileText, Eye, AlertTriangle, Trash } from "lucide-react"
import Spinner from "@/components/Spinner"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { getEnv } from "@/helpers/getEnv"
import { useBlogStore } from "@/store/useBlogStore"
import Loading from "@/components/Loading"
import { TableSkeleton } from "@/components/TableSkeleton"
import { RouteAddBlog, RouteEditBlog, RouteBlogDetails } from "@/helpers/Route"

const Blogs = () => {
    const navigate = useNavigate()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false)
    const [blogToDelete, setBlogToDelete] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const { blogs, loading, fetchBlogs } = useBlogStore()

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleDeleteClick = (blog) => {
        setBlogToDelete(blog)
        setIsDeleteOpen(true)
    }

    const confirmDelete = async () => {
        if (!blogToDelete) return
        setSubmitting(true)
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/delete/${blogToDelete._id}`, {
                method: "DELETE",
                credentials: "include",
            })
            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                setIsDeleteOpen(false)
                setBlogToDelete(null)
                fetchBlogs()
            } else {
                toast.error(result.message || "Delete failed")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const confirmDeleteAll = async () => {
        setSubmitting(true)
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/delete-all`, {
                method: "DELETE",
                credentials: "include",
            })
            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                setIsDeleteAllOpen(false)
                fetchBlogs()
            } else {
                toast.error(result.message || "Delete all failed")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-3 sm:space-y-6 animate-in fade-in duration-500">
            <Card className="border-none shadow-sm bg-background py-2 sm:py-4 gap-2 sm:gap-3">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 sm:px-8 border-b [.border-b]:pb-3 border-border/40 bg-muted/20">
                    <div className="space-y-1.5">
                        <CardTitle className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3 text-foreground">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <FileText className="h-6 w-6 text-primary" strokeWidth={2.5} />
                            </div>
                            Manage Blogs
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground/80">
                            Monitor and organize your digital stories with ease.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {blogs?.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteAllOpen(true)}
                                className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 font-bold text-xs h-10 px-4 flex-1 md:flex-none shadow-sm"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        )}
                        <Button
                            onClick={() => navigate(RouteAddBlog)}
                            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 font-bold text-xs h-10 px-4 flex-1 md:flex-none"
                        >
                            <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
                            New Story
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    {loading ? (
                        <TableSkeleton columns={5} rows={6} />
                    ) : (
                        <div className="rounded-xl border bg-card/50 overflow-x-auto">
                            <div className="min-w-[600px]">
                                <Table>
                                    <TableHeader className="bg-muted/40">
                                        <TableRow>
                                            <TableHead className="font-semibold py-4">Image</TableHead>
                                            <TableHead className="font-semibold py-4">Title</TableHead>
                                            <TableHead className="font-semibold py-4">Category</TableHead>
                                            <TableHead className="font-semibold py-4">Status</TableHead>
                                            <TableHead className="font-semibold py-4 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {blogs?.length > 0 ? (
                                            blogs.map((blog) => (
                                                <TableRow key={blog._id} className="hover:bg-muted/20 transition-all group">
                                                    <TableCell>
                                                        <div className="h-12 w-20 rounded-lg overflow-hidden border border-border/40 shadow-sm transition-transform duration-300 group-hover:scale-105 bg-muted/30">
                                                            {blog.featuredImage ? (
                                                                <img src={blog.featuredImage} alt={blog.title} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center">
                                                                    <FileText className="h-5 w-5 text-muted-foreground/40" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-sm text-foreground max-w-[240px] truncate group-hover:text-primary transition-colors">
                                                        {blog.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="bg-[#4dbbd3]/10 text-[#2d98af] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-[#4dbbd3]/20">
                                                            {blog.category}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animat-pulse" />
                                                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Active</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/20 transition-all"
                                                                onClick={() => navigate(RouteBlogDetails(blog._id))}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-[#4dbbd3] hover:bg-[#4dbbd3]/5 rounded-lg border border-transparent hover:border-[#4dbbd3]/20 transition-all"
                                                                onClick={() => navigate(RouteEditBlog(blog._id))}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg border border-transparent hover:border-destructive/20 transition-all"
                                                                onClick={() => handleDeleteClick(blog)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                                    No blogs found. Start by creating one!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Individual Delete Confirm Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-destructive/10 p-8 flex flex-col items-center justify-center gap-4 text-center border-b border-destructive/20">
                        <div className="h-16 w-16 rounded-2xl bg-destructive/20 flex items-center justify-center rotate-3 shadow-inner">
                            <AlertTriangle className="h-8 w-8 text-destructive" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-black text-destructive tracking-tight uppercase">Delete Blog</DialogTitle>
                            <DialogDescription className="text-sm font-bold text-destructive/70">
                                This action is permanent and irreversible.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 bg-background">
                        <p className="text-sm text-center font-medium text-muted-foreground px-4">
                            Are you sure you want to delete <span className="font-black text-foreground underline decoration-destructive/30 underline-offset-4">"{blogToDelete?.title}"</span>?
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl h-11 border-border/60 font-bold transition-all hover:bg-muted shadow-sm">
                                Keep it
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={submitting} className="rounded-xl h-11 font-black shadow-lg shadow-destructive/20 transition-all active:scale-95">
                                {submitting ? <Spinner className="h-4 w-4" /> : "Yes, Delete"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete All Confirm Dialog */}
            <Dialog open={isDeleteAllOpen} onOpenChange={setIsDeleteAllOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="flex flex-col items-center text-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle>Clear All Blogs</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-destructive">ALL</span> blogs?
                            Your entire blog list will be wiped clean. This is irreversible!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteAllOpen(false)} className="rounded-full">
                            Wait, Go Back
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteAll} disabled={submitting} className="rounded-full font-bold">
                            {submitting ? <Spinner className="h-4 w-4" /> : "Yes, Delete Everything"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Blogs;
