"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodoController = exports.deleteTodoController = exports.createTodoController = exports.getTodoController = exports.getAllTodosController = void 0;
const todoService_1 = require("../services/todoService");
const types_1 = require("../types/types");
const getAllTodosController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        if (!userId) {
            throw new types_1.CustomError("No todos found", 404);
        }
        const todos = yield todoService_1.TodoService.getAllTodos(userId);
        return res.status(200).json(todos);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllTodosController = getAllTodosController;
const getTodoController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            throw new types_1.CustomError("This Id is invalid", 400);
        }
        const todo = yield todoService_1.TodoService.getTodo(id);
        return res.status(200).json(todo);
    }
    catch (err) {
        next(err);
    }
});
exports.getTodoController = getTodoController;
const createTodoController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = req.user.userId;
    if (!body) {
        throw new types_1.CustomError("Invalid input. Please provide input", 400);
    }
    const todoWithUserId = Object.assign(Object.assign({}, body), { userId });
    try {
        const newTodo = yield todoService_1.TodoService.createTodo(todoWithUserId);
        return res.status(201).json(newTodo);
    }
    catch (error) {
        next(error);
    }
});
exports.createTodoController = createTodoController;
const deleteTodoController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            throw new types_1.CustomError("ID must be provided", 400);
        }
        const userId = req.user.userId;
        yield todoService_1.TodoService.deleteTodo(id, userId);
        return res.status(200).json({ message: "Todo deleted successfully!", status: 200 });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteTodoController = deleteTodoController;
const updateTodoController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.id;
        const userId = req.user.userId;
        const body = req.body;
        const updatedTodo = yield todoService_1.TodoService.updateTodo(todoId, userId, body);
        return res.status(200).json(updatedTodo);
    }
    catch (err) {
        if (err instanceof types_1.CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
});
exports.updateTodoController = updateTodoController;
