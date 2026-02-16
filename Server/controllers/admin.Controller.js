import Comment from "../models/commentModel.js";
import { handleError } from "../helpers/handleError.js";

/**
 * @description Show all comments across the platform (Admin only)
 */
export const getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .populate("author", "name avatar email")
            .populate("blogId", "title slug");

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

/**
 * @description Delete any comment (Admin only)
 */
export const deleteAdminComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return next(handleError(404, "Comment not found."));
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully by admin! 🗑️",
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};
