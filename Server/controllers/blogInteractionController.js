import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import { handleError } from "../helpers/handleError.js";

// Toggle Like
export const toggleLike = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return next(handleError(404, "Blog not found"));

        const userId = req.user._id;
        const isLiked = blog.likes.includes(userId);

        if (isLiked) {
            blog.likes = blog.likes.filter(id => id.toString() !== userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();
        res.status(200).json({
            success: true,
            message: isLiked ? "Unliked" : "Liked",
            likesCount: blog.likes.length,
            isLiked: !isLiked
        });
    } catch (error) {
        next(error);
    }
};

// Toggle Save
export const toggleSave = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return next(handleError(404, "Blog not found"));

        const userId = req.user._id;
        const isSaved = blog.saves.includes(userId);

        if (isSaved) {
            blog.saves = blog.saves.filter(id => id.toString() !== userId);
        } else {
            blog.saves.push(userId);
        }

        await blog.save();
        res.status(200).json({
            success: true,
            message: isSaved ? "Removed from saves" : "Saved",
            isSaved: !isSaved
        });
    } catch (error) {
        next(error);
    }
};

// Post Comment or Reply
export const postComment = async (req, res, next) => {
    try {
        const { content, parentId } = req.body;
        const blogId = req.params.blogId;

        const newComment = new Comment({
            blogId,
            author: req.user._id,
            content,
            parentId: parentId || null
        });

        await newComment.save();

        // Populate author info for the response
        const populatedComment = await Comment.findById(newComment._id).populate("author", "name avatar");

        res.status(201).json({
            success: true,
            message: parentId ? "Reply posted" : "Comment posted",
            comment: populatedComment
        });
    } catch (error) {
        next(error);
    }
};

// Get Comments for a Blog
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ blogId: req.params.blogId })
            .populate("author", "name avatar")
            .sort({ createdAt: -1 });

        // Organize comments into a thread structure
        const threadComments = (allComments, parentId = null) => {
            return allComments
                .filter(c => String(c.parentId) === String(parentId))
                .map(c => ({
                    ...c._doc,
                    replies: threadComments(allComments, c._id)
                }));
        };

        const structuredComments = threadComments(comments);

        res.status(200).json({
            success: true,
            comments: structuredComments
        });
    } catch (error) {
        next(error);
    }
};
