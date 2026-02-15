"use client"

import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { User } from "lucide-react"
import { Link } from "react-router-dom"
import { RouteBlogDetails } from "@/helpers/Route"

const BlogCard = ({ blog }) => {
    if (!blog) return null;

    const {
        _id,
        title,
        blogContent,
        featuredImage,
        category,
        author,
        createdAt
    } = blog;

    // Remove HTML tags for content preview
    const plainText = blogContent?.replace(/<[^>]*>?/gm, "") || "";
    const previewText = plainText.length > 80 ? plainText.substring(0, 80) + "..." : plainText;

    // Relative time formatting helper (e.g., "2 h ago")
    const getRelativeTime = (dateString) => {
        if (!dateString) return "Recent";
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours} h ago`;
        return `${diffInDays} d ago`;
    };

    return (
        <Card className="overflow-hidden py-0 gap-0 border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 bg-card rounded-xl flex flex-col h-full group">
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[16/10] group">
                <Link to={RouteBlogDetails(_id)} className="block w-full h-full">
                    <img
                        src={featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
                {/* Category Badge - Repositioned to top-right */}
                <Badge className="absolute top-1.5 right-1.5 bg-[#4dbbd3] hover:bg-[#3daabc] text-white border-none px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase z-10 shadow-sm">
                    {category || "Uncategorized"}
                </Badge>
            </div>

            {/* Content Section */}
            <CardContent className="p-2 flex flex-col flex-grow gap-1">
                {/* Title and Description */}
                <div className="space-y-2 flex-grow">
                    <Link to={RouteBlogDetails(_id)} className="block">
                        <h3 className="text-[18px] font-bold leading-[1.2] text-[#2d3436] line-clamp-2 hover:text-[#4dbbd3] transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <p className="text-[#636e72] text-[14px] leading-[1.5] line-clamp-2">
                        {previewText || "An exploration into the topics of this blog post."}
                    </p>
                </div>

                {/* Author Section */}
                <div className="flex items-center gap-3 mt-auto pt-1">
                    <Avatar className="h-10 w-10 border-none ring-2 ring-primary/5">
                        <AvatarImage src={author?.avatar} alt={author?.name} />
                        <AvatarFallback className="bg-[#f1f2f6] text-[#2d3436]">
                            <User className="h-6 w-6" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <span className="text-[14px] font-bold text-[#2d3436] leading-tight">
                            {author?.name || "Premium Author"}
                        </span>
                        <span className="text-[13px] text-[#b2bec3] leading-tight mt-1 font-medium">
                            {getRelativeTime(createdAt)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BlogCard