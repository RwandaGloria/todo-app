"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const todoController = __importStar(require("../controllers/TodoController"));
const todoService_1 = require("../services/todoService");
const todos_1 = require("./fakes/todos");
const types_1 = require("../types/types");
jest.mock('../services/todoService');
describe('TodoController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllTodosController', () => {
        it('should get all todos for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { user: { userId: 'user123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const todos = [todos_1.fakeTodos[0], todos_1.fakeTodos[1]];
            todoService_1.TodoService.getAllTodos.mockResolvedValue(todos);
            yield todoController.getAllTodosController(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(todos);
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { user: { userId: 'user123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const error = new Error('Internal Server Error');
            todoService_1.TodoService.getAllTodos.mockRejectedValue(error);
            yield todoController.getAllTodosController(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        }));
    });
    describe('getTodoController', () => {
        it('should get a todo by ID for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: 'todo123' }, user: { userId: 'user123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const todo = todos_1.fakeTodos[0];
            todoService_1.TodoService.getTodo.mockResolvedValue(todo);
            yield todoController.getTodoController(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(todo);
        }));
        it('should handle invalid ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: {}, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            yield todoController.getTodoController(req, res, next);
            expect(next).toHaveBeenCalledWith(new types_1.CustomError('This Id is invalid', 400));
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: 'todo123' }, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            const error = new Error('Internal Server Error');
            todoService_1.TodoService.getTodo.mockRejectedValue(error);
            yield todoController.getTodoController(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        }));
    });
    describe('createTodoController', () => {
        it('should create a new todo for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { title: 'New Todo' }, user: { userId: 'user123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const newTodo = todos_1.fakeTodos[0];
            todoService_1.TodoService.createTodo.mockResolvedValue(newTodo);
            yield todoController.createTodoController(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newTodo);
        }));
        it('should handle invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: null, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            try {
                yield todoController.createTodoController(req, res, next);
            }
            catch (error) {
                expect(error).toBeInstanceOf(types_1.CustomError);
                expect(error.message).toBe("Invalid input. Please provide input");
                expect(error.statusCode).toBe(400);
            }
            expect(next).not.toHaveBeenCalled();
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { title: 'New Todo' }, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            const error = new Error('Internal Server Error');
            todoService_1.TodoService.createTodo.mockRejectedValue(error);
            yield todoController.createTodoController(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        }));
    });
    describe('deleteTodoController', () => {
        it('should delete a todo by ID for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: 'todo123' }, user: { userId: 'user123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            yield todoController.deleteTodoController(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Todo deleted successfully!", status: 200 });
        }));
        it('should handle invalid ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: {}, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            yield todoController.deleteTodoController(req, res, next);
            expect(next).toHaveBeenCalledWith(new types_1.CustomError('ID must be provided', 400));
        }));
        it('should handle unauthorized deletion', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: 'todo123' }, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            const error = new types_1.CustomError('Unauthorized: You are not allowed to delete this todo', 403);
            todoService_1.TodoService.deleteTodo.mockRejectedValue(error);
            yield todoController.deleteTodoController(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        }));
        it('should handle not found error', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: 'todo123' }, user: { userId: 'user123' } };
            const res = {};
            const next = jest.fn();
            const error = new types_1.CustomError('Todo not found', 404);
            todoService_1.TodoService.deleteTodo.mockRejectedValue(error);
            yield todoController.deleteTodoController(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        }));
    });
});
describe('updateTodoController', () => {
    it('should update a todo by ID for a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        const updatedTodo = { id: 'todo123', title: 'Updated Todo', userId: 'user123' };
        todoService_1.TodoService.updateTodo.mockResolvedValue(updatedTodo);
        yield todoController.updateTodoController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedTodo);
    }));
    it('should handle CustomError', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' }, body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        const error = new types_1.CustomError('Test error message', 404);
        todoService_1.TodoService.updateTodo.mockRejectedValue(error);
        yield todoController.updateTodoController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test error message' });
    }));
    it('should call next with error', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' }, body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        const error = new Error('Test error');
        todoService_1.TodoService.updateTodo.mockRejectedValue(error);
        yield todoController.updateTodoController(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    }));
});
