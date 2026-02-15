import jwt from "jsonwebtoken";
import { handleError } from "./handleError.js";

export const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(handleError(401, "Unauthorized: No token provided."));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(handleError(403, "Forbidden: Invalid token."));
        }
        req.user = user;
        next();
    });
};
