"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = __importDefault(require("express"));
exports.route = express_1.default.Router();
const todoRoutes_1 = __importDefault(require("./todoRoutes"));
const userRoutes_1 = require("./userRoutes");
const auth_1 = require("../middleware/auth");
exports.route.use("/user/todos", auth_1.authenticateToken, todoRoutes_1.default);
exports.route.use("/user", userRoutes_1.userRoutes);
