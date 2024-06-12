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
const todoService_1 = require("../services/todoService");
const TodoModel_1 = require("../models/TodoModel");
const types_1 = require("../types/types");
const todos_1 = require("./fakes/todos");
describe('getAllTodos', () => {
    it('should return an array of todos for a valid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'validUserId';
        const todo1 = new TodoModel_1.TodoModel(todos_1.fakeTodos[1]);
        const todo2 = new TodoModel_1.TodoModel(todos_1.fakeTodos[2]);
        const expectedTodos = [todo1, todo2];
        jest.spyOn(TodoModel_1.TodoModel, 'findAll').mockResolvedValue(expectedTodos);
        const todos = yield todoService_1.TodoService.getAllTodos(userId);
        expect(todos).toEqual(expectedTodos);
    }));
    it('should return an empty array when no todos are found', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'invalidUserId';
        jest.spyOn(TodoModel_1.TodoModel, 'findAll').mockResolvedValue([]);
        const todos = yield todoService_1.TodoService.getAllTodos(userId);
        expect(todos).toEqual([]);
    }));
});
describe('getTodo', () => {
    it('should return a todo for a valid todo ID and user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'validTodoId';
        const userId = 'validUserId';
        const expectedTodo = new TodoModel_1.TodoModel(todos_1.fakeTodos[4]);
        jest.spyOn(TodoModel_1.TodoModel, 'findOne').mockResolvedValue(expectedTodo);
        const todo = yield todoService_1.TodoService.getTodo(todoId, userId);
        expect(todo).toEqual(expectedTodo);
    }));
    it('should throw a CustomError with status code 404 when no todo is found', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'invalidTodoId';
        const userId = 'validUserId';
        jest.spyOn(TodoModel_1.TodoModel, 'findOne').mockResolvedValue(null);
        yield expect(todoService_1.TodoService.getTodo(todoId, userId)).rejects.toThrow(new types_1.CustomError('No todo found', 404));
    }));
});
describe('createTodo', () => {
    it('should create a new todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const createMock = jest.spyOn(TodoModel_1.TodoModel, 'create').mockResolvedValue({
            title: 'New Todo Title',
            userId: 'userId',
            description: 'New Todo Description',
            isCompleted: false,
        });
        const newTodoData = {
            title: 'New Todo Title',
            userId: 'userId',
            description: 'New Todo Description',
            isCompleted: false,
        };
        const createdTodo = yield todoService_1.TodoService.createTodo(newTodoData);
        expect(createMock).toHaveBeenCalledWith(newTodoData);
        expect(createdTodo).toEqual(expect.objectContaining(newTodoData));
    }));
    it('should throw a CustomError if TodoModel.create fails', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(TodoModel_1.TodoModel, 'create').mockResolvedValue(null);
        const newTodoData = {
            title: 'New Todo Title',
            userId: 'userId',
            description: 'New Todo Description',
            isCompleted: false,
        };
        yield expect(todoService_1.TodoService.createTodo(newTodoData)).rejects.toThrow(new types_1.CustomError('Todo was not created. Please try again later.', 500));
    }));
});
describe('deleteTodo', () => {
    it('should delete the todo with the provided ID and user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'todo-Id';
        const userId = 'user-Id';
        const todo = new TodoModel_1.TodoModel(todos_1.fakeTodos[3]);
        jest.spyOn(TodoModel_1.TodoModel, 'findByPk').mockResolvedValue(todo);
        const deletedObj = jest.spyOn(todo, 'destroy');
        yield todoService_1.TodoService.deleteTodo(todo.id, todo.userId);
        expect(deletedObj).toHaveBeenCalled();
    }));
    it('should not delete the todo and give an throw a Custom error', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'todo-Id';
        const userId = 'user-Id';
        const todo = new TodoModel_1.TodoModel(todos_1.fakeTodos[3]);
        jest.spyOn(TodoModel_1.TodoModel, 'findByPk').mockResolvedValue(todo);
        const deletedObj = jest.spyOn(todo, 'destroy');
        yield todoService_1.TodoService.deleteTodo(todo.id, todo.userId);
        yield expect(todoService_1.TodoService.deleteTodo(todoId, userId)).rejects.toThrow(new types_1.CustomError('Unauthorized: You are not allowed to delete this todo', 403));
    }));
    it('should throw a CustomError with status code 404 when no todo is found', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'todo-id';
        const userId = 'user-id';
        jest.spyOn(TodoModel_1.TodoModel, 'findByPk').mockResolvedValue(null);
        yield expect(todoService_1.TodoService.deleteTodo(todoId, userId)).rejects.toThrow(new types_1.CustomError('Todo not found', 404));
    }));
    it('should throw a CustomError with status code 403 when the user is unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'validTodoId';
        const userId = 'unauthorizedUserId';
        const todo = new TodoModel_1.TodoModel(todos_1.fakeTodos[0]);
        jest.spyOn(TodoModel_1.TodoModel, 'findByPk').mockResolvedValue(todo);
        yield expect(todoService_1.TodoService.deleteTodo(todoId, userId)).rejects.toThrow(new types_1.CustomError('Unauthorized: You are not allowed to delete this todo', 403));
    }));
});
describe('updateTodo', () => {
    it('should update the todo with the provided data', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'validTodoId';
        const userId = 'validUserId';
        const updateData = { title: 'Updated Title' };
        const todo = todos_1.fakeTodos[0];
        jest.spyOn(TodoModel_1.TodoModel, "findOne").mockResolvedValue({
            id: todo.id,
            title: todo.title,
            userId: todo.userId,
            description: '',
            isCompleted: false,
            isNewRecord: false,
            sequelize: {},
            where: {},
            getDataValue: jest.fn(),
            _attributes: {},
            _creationAttributes: {},
            update: jest.fn().mockResolvedValue(undefined),
            dataValues: {},
            _modelOptions: {},
            _options: {},
        });
        const todoInstance = yield TodoModel_1.TodoModel.findOne();
        yield todoService_1.TodoService.updateTodo(todoId, userId, updateData);
        expect(todoInstance === null || todoInstance === void 0 ? void 0 : todoInstance.update).toHaveBeenCalledWith(updateData);
    }));
    it('should throw a CustomError with status code 404 when no todo is found', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 'invalidTodoId';
        const userId = 'validUserId';
        jest.spyOn(TodoModel_1.TodoModel, 'findOne').mockResolvedValue(null);
        yield expect(todoService_1.TodoService.updateTodo(todoId, userId, {})).rejects.toThrow(new types_1.CustomError('Todo not found', 404));
    }));
});
