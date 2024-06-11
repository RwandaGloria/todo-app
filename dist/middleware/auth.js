"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const types_1 = require("../types/types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next(new types_1.CustomError('Token not provided', 401));
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return next(new types_1.CustomError('Token is invalid', 403));
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
