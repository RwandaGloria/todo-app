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
class TodoService {
    static getAllTodos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield TodoModel_1.TodoModel.findAll({ where: { userId } });
                if (todos.length === 0) {
                    throw { message: "No todos found", statusCode: 200 };
                }
                return todos;
            }
            catch (err) {
                throw { message: "Error fetching todos", statusCode: 500 };
            }
        });
    }
}
exports.TodoService = TodoService;
