import Category from "../models/categoryModel.js";
import { handleError } from "../helpers/handleError.js";
import slugify from "slugify";

// Add Category
export const addCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return next(handleError(400, "Category name is required"));
        }
        const slug = slugify(name, { lower: true });
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return next(handleError(400, "Category already exists"));
        }
        const category = await Category.create({ name, slug });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

// Update Category
export const updateCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const { name } = req.body;
        const slug = slugify(name, { lower: true });

        const category = await Category.findByIdAndUpdate(
            category_id,
            { name, slug },
            { new: true }
        );

        if (!category) {
            return next(handleError(404, "Category not found"));
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

// Show Category
export const showCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const category = await Category.findById(category_id);
        if (!category) {
            return next(handleError(404, "Category not found"));
        }
        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

// Delete Category
export const deleteCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const category = await Category.findByIdAndDelete(category_id);
        if (!category) {
            return next(handleError(404, "Category not found"));
        }
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

// GetAll Category
export const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

// Delete All Category
export const deleteAllCategory = async (req, res, next) => {
    try {
        await Category.deleteMany({});
        res.status(200).json({
            success: true,
            message: "All categories deleted successfully"
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}