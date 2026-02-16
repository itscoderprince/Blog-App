import express from "express";
import { getAllComments, deleteAdminComment } from "../controllers/admin.Controller.js";
import { authenticate, isAdmin } from "../helpers/authenticate.js";

const router = express.Router();

// Admin Only - Comment Management
router.get("/all-comments", authenticate, isAdmin, getAllComments);
router.delete("/delete-comment/:id", authenticate, isAdmin, deleteAdminComment);

export default router;
