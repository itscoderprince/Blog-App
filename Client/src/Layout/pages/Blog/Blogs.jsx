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
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="border-none shadow-sm bg-background py-4 gap-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Manage Blogs
                        </CardTitle>
                        <CardDescription>
                            Organize and manage your published content.
                        </CardDescription>
                    </div>
                    <CardAction className="flex gap-2">
                        {blogs?.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteAllOpen(true)}
                                className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete All
                            </Button>
                        )}
                        <Button
                            onClick={() => navigate(RouteAddBlog)}
                            className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Loading fullPage={false} />
                    ) : (
                        <div className="rounded-xl border bg-card/50 overflow-hidden">
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
                                                    <div className="h-10 w-16 rounded overflow-hidden bg-muted">
                                                        {blog.featuredImage ? (
                                                            <img src={blog.featuredImage} alt={blog.title} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium max-w-[200px] truncate">{blog.title}</TableCell>
                                                <TableCell>
                                                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                        {blog.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground italic">Published</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full"
                                                            onClick={() => navigate(RouteBlogDetails(blog._id))}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full"
                                                            onClick={() => navigate(RouteEditBlog(blog._id))}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
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
                    )}
                </CardContent>
            </Card>

            {/* Individual Delete Confirm Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="flex flex-col items-center text-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle>Delete Blog</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-foreground">"{blogToDelete?.title}"</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-full">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={submitting} className="rounded-full">
                            {submitting ? <Spinner className="h-4 w-4" /> : "Yes, Delete"}
                        </Button>
                    </DialogFooter>
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
