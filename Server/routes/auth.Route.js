import express from "express";
import { Login, Register, google } from "../controllers/auth.Controller.js";

const route = express.Router();

route.post('/register', Register)
route.post('/login', Login)
route.post('/google', google)

export default route;