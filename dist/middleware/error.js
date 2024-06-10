"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const Error_1 = require("../types/Error");
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res, next) {
    try {
        next();
    }
    catch (err) {
        if (err instanceof Error_1.CustomError) {
            logger_1.default.error(`${err.message}\n${err.stack}`);
            return res.status(err.statusCode).json({ message: err.message || "Please try again later" });
        }
        const error = err;
        logger_1.default.error(`${error.message}\n${error.stack}`);
        return res.status(500).json({ message: "Server error occurred. Please try again later" });
    }
}
exports.errorHandler = errorHandler;
