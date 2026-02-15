"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useBlogStore } from "@/store/useBlogStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, MessageCircle, Heart, Facebook, Twitter, Linkedin, Bookmark } from "lucide-react"
import Loading from "@/components/Loading"
import { Card } from "@/components/ui/card"
import { RouteBlogDetails } from "@/helpers/Route"
import CommentSection from "@/components/CommentSection"

// Compact internal component for Sidebar Related Blogs
const SideBlogCard = ({ blog }) => {
    const { _id, title, featuredImage, createdAt } = blog
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })

    return (
        <Link to={RouteBlogDetails(_id)} className="group flex flex-col gap-3 hover:bg-muted/50 p-3 rounded-2xl transition-all border border-transparent hover:border-border/40">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                <img src={featuredImage} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col gap-1.5 px-1">
                <h4 className="text-[14px] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[#4dbbd3]">
                    {title}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {formattedDate}
                    </span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        4 min read
                    </span>
                </div>
            </div>
        </Link>
    )
}

const BlogDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { blogs, fetchBlogs, fetchSingleBlog, toggleLike, toggleSave } = useBlogStore()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [isCommentOpen, setIsCommentOpen] = useState(false)

    useEffect(() => {
        const getBlog = async () => {
            const data = await fetchSingleBlog(id)
            if (data) {
                setBlog(data)
                setLikesCount(data.likes?.length || 0)
                if (user) {
                    setIsLiked(data.likes?.includes(user._id))
                    setIsBookmarked(data.saves?.includes(user._id))
                }
            }
            setLoading(false)
        }

        // Ensure we have blogs for the related sidebar
        if (blogs.length === 0) {
            fetchBlogs()
        }

        getBlog()
        window.scrollTo(0, 0)
    }, [id])

    if (loading) return <Loading fullPage={false} />

    if (!blog) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
                <p className="text-muted-foreground mb-6">The story you are looking for might have been moved or deleted.</p>
                <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>
            </div>
        )
    }

    const { title, blogContent, featuredImage, category, author, createdAt } = blog
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    // Filter related blogs (same category, excluding current)
    const relatedBlogs = blogs
        .filter(b => b._id !== id)
        .slice(0, 5)

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like this post")
            return
        }
        const data = await toggleLike(id)
        if (data.success) {
            setIsLiked(data.isLiked)
            setLikesCount(data.likesCount)
            toast.success(data.message)
        }
    }

    const handleSave = async () => {
        if (!user) {
            toast.error("Please login to save this post")
            return
        }
        const data = await toggleSave(id)
        if (data.success) {
            setIsBookmarked(data.isSaved)
            toast.success(data.message)
        }
    }

    const handleCommentToggle = () => {
        setIsCommentOpen(!isCommentOpen)
        // Smooth scroll to comments if opening
        if (!isCommentOpen) {
            setTimeout(() => {
                document.getElementById('discussion-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }

    return (
        <div className="min-h-screen bg-background animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="container mx-auto px-4 max-w-7xl">
                <Button
                    onClick={() => navigate("/")}
                    variant="ghost"
                    size="sm"
                    className="mb-4 hover:bg-accent/50 -ml-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Button>
            </div>

            <main className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Side: 75% Content (9/12 cols) */}
                    <div className="lg:col-span-9">
                        <div className="flex flex-col gap-6 mb-8">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                                {title}
                            </h1>
                        </div>

                        {/* Article Image */}
                        <div className="relative rounded-2xl overflow-hidden mb-8">
                            <img src={featuredImage} alt={title} className="w-full h-auto object-cover" />
                            <Badge className="absolute top-4 right-4 bg-[#4dbbd3] hover:bg-[#3daabc] text-white border-none px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase z-10">
                                {category}
                            </Badge>
                        </div>

                        {/* Author & Share Section - Now below image */}
                        <div className="flex flex-col gap-6 py-2 border-y border-border/40 mb-8">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-11 w-11 ring-2 ring-primary/5">
                                        <AvatarImage src={author?.avatar} alt={author?.name} />
                                        <AvatarFallback className="bg-primary/5 text-primary">
                                            <User className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm md:text-md font-bold leading-tight">{author?.name}</span>
                                        <div className="flex items-center gap-2 text-[12px] text-muted-foreground mt-0.5 font-medium">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formattedDate}</span>
                                            <span className="mx-0.5">•</span>
                                            <span>6 min read</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Integrated Social Share Links on the right */}
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Share this post</span>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/50 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110">
                                            <Facebook className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/50 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110">
                                            <Twitter className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/50 hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-110">
                                            <Linkedin className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <article className="max-w-none mb-16">
                            <div
                                className="prose prose-md md:prose-lg dark:prose-invert prose-slate 
                                prose-headings:font-bold prose-headings:tracking-tight 
                                prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                                prose-img:rounded-xl prose-img:shadow-md
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:italic"
                                dangerouslySetInnerHTML={{ __html: blogContent }}
                            />
                        </article>

                        {/* Interactive Section */}
                        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-t border-border/40 mt-8 mb-6">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 transition-all group ${isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                                >
                                    <Heart className={`h-5 w-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-sm font-bold">{likesCount}</span>
                                </button>
                                <button
                                    onClick={handleCommentToggle}
                                    className="flex items-center gap-2 text-muted-foreground hover:text-[#4dbbd3] transition-all group"
                                >
                                    <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                                    <span className="text-sm font-bold">{totalComments}</span>
                                </button>
                            </div>

                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 transition-all p-2 rounded-full border border-border/40 hover:bg-accent ${isBookmarked ? 'bg-primary/5 text-[#4dbbd3] border-[#4dbbd3]/30' : 'text-muted-foreground'}`}
                                title={isBookmarked ? "Saved to bookmarks" : "Save post"}
                            >
                                <Bookmark className={`h-5 w-5 transition-transform ${isBookmarked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
                                <span className="text-xs font-bold uppercase tracking-wider pr-1">
                                    {isBookmarked ? "Saved" : "Save"}
                                </span>
                            </button>
                        </div>

                        {/* Comment Section Standalone Component */}
                        <div id="discussion-section">
                            <CommentSection
                                blogId={id}
                                isOpen={isCommentOpen}
                                setIsOpen={setIsCommentOpen}
                                onCountChange={setTotalComments}
                            />
                        </div>
                    </div>

                    {/* Right Side: 25% Sidebar (3/12 cols) */}
                    <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 h-fit">
                        {/* Related Blogs Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-md font-extrabold uppercase tracking-wider text-foreground">
                                    Related Stories
                                </h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {relatedBlogs.length > 0 ? (
                                    relatedBlogs.map((b) => (
                                        <SideBlogCard key={b._id} blog={b} />
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No other stories found in this category.</p>
                                )}
                            </div>
                        </div>

                        {/* Newsletter/Action Box */}
                        <Card className="p-5 bg-[#4dbbd3]/5 border-[#4dbbd3]/20 rounded-2xl gap-4">
                            <h4 className="font-bold text-sm">Subscribe to our newsletter</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Get the latest stories and insights delivered straight to your inbox.
                            </p>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="text-xs p-2 rounded-lg bg-background border border-border/50 focus:outline-primary"
                                />
                                <Button size="sm" className="bg-[#4dbbd3] hover:bg-[#3daabc] text-white w-full rounded-lg text-[10px] font-bold uppercase py-4">
                                    Subscribe Now
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default BlogDetail