"use client"

import { useEffect } from "react"
import { useParams } from "react-router-dom"
import BlogCard from "@/components/BlogCard"
import { BlogSkeleton } from "@/components/BlogSkeleton"
import { useBlogStore } from "@/store/useBlogStore"
import { FileText } from "lucide-react"

const CategoryBlogs = () => {
    const { categoryName } = useParams()
    const { blogs, loading, fetchBlogs } = useBlogStore()

    useEffect(() => {
        fetchBlogs(categoryName)
    }, [categoryName])

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="space-y-1.5 border-b border-border/40 pb-6">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <FileText className="h-6 w-6 text-primary" strokeWidth={2.5} />
                    </div>
                    Category: <span className="text-primary">{categoryName}</span>
                </h2>
                <p className="text-muted-foreground text-md font-medium">
                    Discover all stories published under the <span className="font-bold underline decoration-primary/30 underline-offset-4">{categoryName}</span> category.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {loading
                    ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <BlogSkeleton key={i} />)
                    : blogs.length > 0 ? (
                        blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <p className="text-lg font-bold text-muted-foreground">No blogs found in this category.</p>
                            <p className="text-sm text-muted-foreground/60">Be the first to share a story here!</p>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default CategoryBlogs
