import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    featuredImage: {
        type: String,
        required: true,
    },
    blogContent: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
