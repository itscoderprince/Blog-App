import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.Route.js";
import userRoute from "./routes/user.Route.js";
import categoryRoute from "./routes/category.Route.js";
import blogRoute from "./routes/blog.Route.js";

// Configure env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/blog', blogRoute)

// Database connection;
mongoose.connect(process.env.MONGODB_URI, { dbName: "blog_app" })
    .then(() => console.log("Database connected successfully ✅"))
    .catch((err) => console.log("Database connection failed ❌", err))

// Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error."
    res.status(statusCode).json({
        sucess: false,
        statusCode,
        message
    })
})

export default app;