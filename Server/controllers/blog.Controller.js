import Blog from "../models/blogModel.js";
import Category from "../models/categoryModel.js";
import { handleError } from "../helpers/handleError.js";
import { uploadOnCloudinary } from "../helpers/cloudinary.js";
import slugify from "slugify";

/**
 * @description Add a new blog post
 * @step 1. Extract data from request body and file
 * @step 2. Validate required fields
 * @step 3. Upload image to Cloudinary
 * @step 4. Create and save blog post
 */
export const addBlog = async (req, res, next) => {
    try {
        const { category, title, slug, blogContent } = req.body;
        const author = req.user._id; // Attached by authenticate middleware

        if (!category || !title || !blogContent) {
            return next(handleError(400, "All required fields must be provided."));
        }

        if (!req.file) {
            return next(handleError(400, "Featured image is required."));
        }

        // Upload image to Cloudinary in the blogs folder
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path, "mern_blog/blogs");

        if (!cloudinaryResponse) {
            return next(handleError(500, "Failed to upload image to Cloudinary."));
        }

        const newBlog = new Blog({
            author,
            category,
            title,
            slug: slug || slugify(title, { lower: true }),
            blogContent,
            featuredImage: cloudinaryResponse.secure_url,
        });

        await newBlog.save();

        res.status(201).json({
            success: true,
            blog: newBlog,
            message: "Blog post added successfully! ✅",
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

/**
 * @description Update an existing blog post
 * @step 1. Find the blog by ID
 * @step 2. Check permissions (only author or admin)
 * @step 3. Update fields (and image if provided)
 * @step 4. Save changes
 */
export const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category, title, slug, blogContent } = req.body;

        const blog = await Blog.findById(id);

        if (!blog) {
            return next(handleError(404, "Blog post not found."));
        }

        // Authorization check: Only author or admin can update
        if (blog.author.toString() !== req.user._id && req.user.role !== 'admin') {
            return next(handleError(403, "You are not authorized to edit this blog."));
        }

        let imageUrl = blog.featuredImage;

        // If a new image is uploaded, send it to Cloudinary
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path, "mern_blog/blogs");
            if (cloudinaryResponse) {
                imageUrl = cloudinaryResponse.secure_url;
            }
        }

        blog.category = category || blog.category;
        blog.title = title || blog.title;
        blog.slug = slug || blog.slug;
        blog.blogContent = blogContent || blog.blogContent;
        blog.featuredImage = imageUrl;

        await blog.save();

        res.status(200).json({
            success: true,
            blog,
            message: "Blog post updated successfully! ✅",
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

/**
 * @description Delete a blog post
 */
export const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return next(handleError(404, "Blog post not found."));
        }

        // Authorization check
        if (blog.author.toString() !== req.user._id && req.user.role !== 'admin') {
            return next(handleError(403, "You are not authorized to delete this blog."));
        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog post deleted successfully! 🗑️",
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

/**
 * @description Show all blog posts
 */
export const showAll = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            const foundCategory = await Category.findOne({ slug: category });
            if (foundCategory) {
                query.category = foundCategory.name;
            } else {
                query.category = category;
            }
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { blogContent: { $regex: search, $options: "i" } }
            ];
        }

        const blogs = await Blog.find(query).sort({ createdAt: -1 }).populate("author", "name avatar");

        res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

/**
 * @description Get a single blog post by ID
 */
export const getSingleBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).populate("author", "name avatar");

        if (!blog) {
            return next(handleError(404, "Blog post not found."));
        }

        res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

