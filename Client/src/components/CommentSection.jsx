import React, { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Reply, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBlogStore } from "@/store/useBlogStore"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"

const CommentItem = ({ item, level = 0, onReply, replyingTo, setReplyingTo, replyText, setReplyText, handlePostReply }) => {
    const isReply = level > 0;
    const isReplyingHere = replyingTo === item._id;

    return (
        <div className={cn("flex flex-col gap-3", isReply && "ml-4 sm:ml-8 md:ml-12 border-l border-border/40 pl-3 sm:pl-4")}>
            <div className="flex gap-3 group">
                <Avatar className={cn(
                    "shrink-0 border group-hover:ring-2 ring-primary/20 transition-all",
                    isReply ? "h-8 w-8" : "h-10 w-10"
                )}>
                    <AvatarImage src={item.author?.avatar} alt={item.author?.name} />
                    <AvatarFallback className={isReply ? "text-[10px]" : "text-xs"}>
                        {item.author?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className={cn("font-bold text-[#2d3436]", isReply ? "text-xs" : "text-sm")}>
                            {item.author?.name || "Deleted User"}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                    </div>

                    <div className={cn(
                        "text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-border/20",
                        isReply ? "text-[13px]" : "text-sm"
                    )}>
                        {item.content}
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                        {!isReplyingHere && (
                            <button
                                onClick={() => {
                                    setReplyingTo(item._id);
                                    setReplyText("");
                                }}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-[#4dbbd3] transition-colors uppercase tracking-wider"
                            >
                                <Reply className="h-3 w-3" />
                                Reply
                            </button>
                        )}
                    </div>

                    {/* Inline Reply Input directly under the comment */}
                    {isReplyingHere && (
                        <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex gap-3 bg-muted/10 p-3 rounded-2xl border border-dashed border-border/60">
                                <Avatar className="h-6 w-6 shrink-0 border">
                                    <AvatarFallback className="text-[9px]">U</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="Write a reply..."
                                        className="min-h-[50px] text-xs resize-none focus-visible:ring-[#4dbbd3] bg-background rounded-xl"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[9px] h-7 px-2 uppercase font-bold tracking-wider"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handlePostReply(item._id)}
                                            disabled={!replyText.trim()}
                                            className="h-7 rounded-full bg-[#4dbbd3] hover:bg-[#3daabc] text-white text-[9px] font-bold uppercase px-4"
                                        >
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Render Nested Replies */}
            {item.replies && item.replies.length > 0 && (
                <div className="space-y-4">
                    {item.replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            item={reply}
                            level={level + 1}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            handlePostReply={handlePostReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ blogId, isOpen, setIsOpen, onCountChange }) => {
    const [mainComment, setMainComment] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [comments, setComments] = useState([]);

    const { user } = useAuthStore();
    const { fetchComments, addComment } = useBlogStore();

    useEffect(() => {
        if (blogId) {
            loadComments();
        }
    }, [blogId]);

    const loadComments = async () => {
        const data = await fetchComments(blogId);
        const commentList = data || [];
        setComments(commentList);
        if (onCountChange) {
            onCountChange(calculateTotalComments(commentList));
        }
    };

    const calculateTotalComments = (list) => {
        return list.length + list.reduce((acc, c) => acc + (c.replies ? calculateTotalComments(c.replies) : 0), 0);
    };

    const handlePostMainComment = async () => {
        if (!user) {
            toast.error("Please login to comment");
            return;
        }
        if (!mainComment.trim()) return;

        const data = await addComment(blogId, mainComment);
        if (data.success) {
            toast.success(data.message);
            setMainComment("");
            loadComments();
        } else {
            toast.error(data.message || "Failed to post comment");
        }
    };

    const handlePostReply = async (parentId) => {
        if (!user) {
            toast.error("Please login to reply");
            return;
        }
        if (!replyText.trim()) return;

        const data = await addComment(blogId, replyText, parentId);
        if (data.success) {
            toast.success(data.message);
            setReplyText("");
            setReplyingTo(null);
            loadComments(); // Refresh comments list
        } else {
            toast.error(data.message || "Failed to post reply");
        }
    };

    return (
        <section className="mt-6 border-t py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group py-2"
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isOpen ? "bg-primary/10" : "bg-muted group-hover:bg-primary/10"
                    )}>
                        <MessageSquare className={cn(
                            "h-5 w-5 transition-colors",
                            isOpen ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-[#2d3436]">
                        Discussion ({calculateTotalComments(comments)})
                    </h3>
                </div>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )
                }
            </button>

            {isOpen && (
                <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Main Comment Input */}
                    <div className="flex gap-4 mb-12">
                        <Avatar className="h-10 w-10 shrink-0 border">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="Join the discussion..."
                                className="min-h-[100px] resize-none focus-visible:ring-[#4dbbd3] rounded-2xl bg-muted/20 border-border/40"
                                value={mainComment}
                                onChange={(e) => setMainComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handlePostMainComment}
                                    disabled={!mainComment.trim()}
                                    className="rounded-full px-6 gap-2 bg-[#4dbbd3] hover:bg-[#3daabc] text-white shadow-lg shadow-[#4dbbd3]/20 transition-all hover:scale-105 active:scale-95 text-xs font-bold uppercase"
                                >
                                    <Send className="h-4 w-4" />
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-10">
                        {comments.length > 0 ? (
                            comments.map((item) => (
                                <CommentItem
                                    key={item._id}
                                    item={item}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    handlePostReply={handlePostReply}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground text-sm italic">No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

export default CommentSection;
