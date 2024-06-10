"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoRoutes = express_1.default.Router();
const TodoController_1 = require("../controllers/TodoController");
todoRoutes.get("/todos", TodoController_1.getAllTodosController);
exports.default = todoRoutes;
