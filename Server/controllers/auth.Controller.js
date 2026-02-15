import { handleError } from "../helpers/handleError.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

// Register
export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return next(handleError(404, "All fields are required ❌"))

        // Checking existing user
        const existUser = await User.findOne({ email });
        if (existUser) return next(handleError(409, 'User already registred ⚠'))

        const hashedPassword = bcrypt.hashSync(password, 10)

        // Register new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(200).json({
            success: true,
            message: "Registration successfully ✅"
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

// Google Auth
export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                fromGoogle: user.fromGoogle
            }, process.env.JWT_SECRET);

            const { password, ...rest } = user._doc;

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
            }).status(200).json({
                success: true,
                user: rest,
                message: "Login successfully ✅"
            });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                name: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                avatar: googlePhotoUrl,
                fromGoogle: true
            });
            await newUser.save();

            const token = jwt.sign({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar,
                fromGoogle: newUser.fromGoogle
            }, process.env.JWT_SECRET);

            const { password, ...rest } = newUser._doc;

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
            }).status(200).json({
                success: true,
                user: rest,
                message: "Login successfully ✅"
            });
        }
    } catch (error) {
        next(handleError(500, error.message))
    }
}

// Login
export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return next(handleError(404, "All fields are required ❌"))

        const user = await User.findOne({ email });
        if (!user) return next(handleError(404, 'User not found ❌'))

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) return next(handleError(404, 'Invalid Credentials ⚠'))

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }, process.env.JWT_SECRET);

        const { password: hashedPassword, ...rest } = user._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        })

        res.status(200).json({
            success: true,
            user: rest,
            message: 'Login successfully ✅'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}