import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export interface CustomRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new CustomError('Token not provided', 401));
    }

    jwt.verify(token, JWT_SECRET_KEY, (err: any, user: any) => {
        if (err) {
            return next(new CustomError('Token is invalid', 403));
        }
        req.user = user; 
        next();
    });
};
