import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.Route.js";
import userRoute from "./routes/user.Route.js";
import categoryRoute from "./routes/category.Route.js";
import blogRoute from "./routes/blog.Route.js";
import adminRoute from "./routes/admin.Route.js";

// Configure env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://10.92.212.176:5173",
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/blog', blogRoute)
app.use('/api/admin', adminRoute)

// Database connection & Server Startup
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "blog_app",
            serverSelectionTimeoutMS: 5000, // Error after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log("Database connected successfully ✅");

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on http://10.92.212.176:${PORT}`);
            console.log(`🚀 Locally: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Database connection failed ❌", err);
        process.exit(1); // Exit if DB connection fails
    }
};

connectDB();

// Handle runtime connection errors
mongoose.connection.on('error', (err) => {
    console.error('Mongoose runtime error:', err);
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