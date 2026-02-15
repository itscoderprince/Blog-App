import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
