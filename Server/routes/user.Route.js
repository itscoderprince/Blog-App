import express from "express";
import { getUser, updateUser, getAllUsers, deleteUser, updateUserRole } from "../controllers/user.Controller.js";
import upload from "../helpers/multer.js";
import { authenticate, isAdmin } from "../helpers/authenticate.js";

const route = express.Router();

// Profile routes
route.get('/get-user/:userId', getUser)
route.put('/update-user/:userId', authenticate, upload.single('avatar'), updateUser)

// Admin routes
route.get('/all', authenticate, isAdmin, getAllUsers)
route.delete('/delete/:id', authenticate, isAdmin, deleteUser)
route.put('/update-role/:id', authenticate, isAdmin, updateUserRole)

export default route;