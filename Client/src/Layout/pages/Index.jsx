"use client"

import { useEffect } from "react"
import BlogCard from "@/components/BlogCard"
import { BlogSkeleton } from "@/components/BlogSkeleton"
import { useBlogStore } from "@/store/useBlogStore"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"

const Index = () => {
  const { blogs, loading, fetchBlogs } = useBlogStore()

  useEffect(() => {
    fetchBlogs()
  }, [])


  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className="bg-muted p-6 rounded-full mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">No Blogs Found</h2>
        <p className="text-muted-foreground max-w-sm mt-2">
          Start by writing shared knowledge and experiences to share with the world!
        </p>
      </div>
    )
  }

  return (
    <div className="w-full animate-in fade-in duration-700">
      <div className="text-left space-y-1 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Latest <span className="text-primary italic">Stories</span>
        </h1>
        <p className="text-muted-foreground text-md">
          Explore the most recent insights, updates, and innovations from our community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <BlogSkeleton key={i} />)
          : blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
      </div>
    </div>
  )
}

export default Index
