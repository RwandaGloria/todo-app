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
exports.TodoService = void 0;
const TodoModel_1 = require("../models/TodoModel");
const types_1 = require("../types/types");
class TodoService {
    static getAllTodos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield TodoModel_1.TodoModel.findAll({ where: { userId } });
                if (todos.length === 0) {
                    throw new types_1.CustomError("No todos found", 404);
                }
                return todos;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    static getTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todo = yield TodoModel_1.TodoModel.findOne({ where: { id: id } });
                if (!todo) {
                    throw new types_1.CustomError("No todo found", 404);
                }
                return todo;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static createTodo(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTodo = yield TodoModel_1.TodoModel.create(body);
            if (!newTodo) {
                throw new types_1.CustomError("Todo was not created. Please try again later.", 500);
            }
            return newTodo;
        });
    }
    static deleteTodo(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield TodoModel_1.TodoModel.findByPk(id);
            if (!todo) {
                throw new types_1.CustomError('Todo not found', 404);
            }
            if (todo.userId !== userId) {
                throw new types_1.CustomError('Unauthorized: You are not allowed to delete this todo', 403);
            }
            yield todo.destroy();
        });
    }
}
exports.TodoService = TodoService;
