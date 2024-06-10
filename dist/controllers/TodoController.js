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
exports.getAllTodosController = void 0;
const todoService_1 = require("../services/todoService");
const Error_1 = require("../types/Error");
const getAllTodosController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        console.log("IM here too in the controller");
        if (!userId) {
            throw new Error_1.CustomError("User Id not provided", 400);
        }
        const todos = yield todoService_1.TodoService.getAllTodos(userId);
        return res.status(200).json(todos);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTodosController = getAllTodosController;
