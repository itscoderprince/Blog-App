import express from "express";
import { getUser, updateUser } from "../controllers/user.Controller.js";
import upload from "../helpers/multer.js";

const route = express.Router();

route.get('/get-user/:userId', getUser)
route.put('/update-user/:userId', upload.single('avatar'), updateUser)


export default route;