import express from "express";
import { addBlog, updateBlog, deleteBlog, showAll, getSingleBlog } from "../controllers/blog.Controller.js";
import { toggleLike, toggleSave, postComment, getComments } from "../controllers/blogInteractionController.js";
import { authenticate } from "../helpers/authenticate.js";
import upload from "../helpers/multer.js";

const router = express.Router();

// Public routes
router.get("/all", showAll);
router.get("/single/:id", getSingleBlog);
router.get("/comments/:blogId", getComments);

// Protected routes
router.post("/add", authenticate, upload.single("featuredImage"), addBlog);
router.put("/update/:id", authenticate, upload.single("featuredImage"), updateBlog);
router.delete("/delete/:id", authenticate, deleteBlog);

// Interaction routes
router.put("/like/:id", authenticate, toggleLike);
router.put("/save/:id", authenticate, toggleSave);
router.post("/comment/:blogId", authenticate, postComment);

export default router;
