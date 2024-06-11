"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoRoutes = express_1.default.Router();
const TodoController_1 = require("../controllers/TodoController");
const validators_1 = require("../middleware/validators");
todoRoutes.get("/", TodoController_1.getAllTodosController);
todoRoutes.get("/:id", validators_1.validateGetTodo, TodoController_1.getTodoController);
todoRoutes.post("/", validators_1.validateCreateTodo, TodoController_1.createTodoController);
todoRoutes.delete("/:id", validators_1.validateDeleteTodo, TodoController_1.deleteTodoController);
todoRoutes.put("/:id", validators_1.validateUpdateTodo, TodoController_1.updateTodoController);
exports.default = todoRoutes;
