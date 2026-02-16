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
import { Trash2, MessageSquare, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { getEnv } from "@/helpers/getEnv"
import { TableSkeleton } from "@/components/TableSkeleton"
import { RouteBlogDetails } from "@/helpers/Route"

const ManageComments = () => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/admin/all-comments`, {
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                setComments(data.comments)
            } else {
                toast.error(data.message || "Unauthorized access")
            }
        } catch (error) {
            toast.error("Failed to connect to the server")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (id) => {
        if (!confirm("Are you sure you want to delete this comment?")) return

        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/admin/delete-comment/${id}`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
                setComments(comments.filter(c => c._id !== id))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Error deleting comment")
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <MessageSquare className="h-6 w-6 text-primary" strokeWidth={2.5} />
                        </div>
                        Manage Comments
                    </h2>
                    <p className="text-muted-foreground text-md font-medium">
                        Moderate community discussions and remove inappropriate content.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b bg-muted/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            All Discussions
                            <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 text-[10px] font-bold">
                                {comments.length} COMMENTS
                            </Badge>
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20 hover:bg-muted/20 border-b transition-none">
                                    <TableHead className="font-bold text-foreground pl-6 py-4">Author</TableHead>
                                    <TableHead className="font-bold text-foreground py-4">Comment Content</TableHead>
                                    <TableHead className="font-bold text-foreground py-4">Blog Post</TableHead>
                                    <TableHead className="font-bold text-foreground py-4">Date</TableHead>
                                    <TableHead className="text-right font-bold text-foreground pr-6 py-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton columns={5} rows={5} />
                                ) : comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <TableRow key={comment._id} className="group hover:bg-muted/30 transition-colors border-b last:border-0 border-border/40">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-border">
                                                        <AvatarImage src={comment.author?.avatar} />
                                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                            {comment.author?.name?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground tracking-tight line-clamp-1">
                                                            {comment.author?.name}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase truncate w-24">
                                                            {comment.author?.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <p className="text-sm font-medium text-foreground/90 line-clamp-2 max-w-sm leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Link
                                                    to={RouteBlogDetails(comment.blogId?.slug)}
                                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline transition-all"
                                                >
                                                    <span className="max-w-[150px] truncate">{comment.blogId?.title}</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </TableCell>
                                            <TableCell className="py-4 truncate text-xs font-semibold text-muted-foreground/80">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                                            No comments found.
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

export default ManageComments
