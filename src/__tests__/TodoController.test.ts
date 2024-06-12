import { Request, Response, NextFunction } from 'express';
import * as todoController from '../controllers/TodoController';
import { TodoService } from '../services/todoService';
import { TodoModel } from '../models/TodoModel';
import { fakeTodos } from './fakes/todos';
import { CustomError } from '../types/types';
jest.mock('../services/todoService');

describe('TodoController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodosController', () => {
    it('should get all todos for a user', async () => {
      const req = { user: { userId: 'user123' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
      const todos =  [fakeTodos[0], fakeTodos[1]];

      (TodoService.getAllTodos as jest.Mock).mockResolvedValue(todos);

      await todoController.getAllTodosController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should handle errors', async () => {
      const req = { user: { userId: 'user123' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
      const error = new Error('Internal Server Error');

      (TodoService.getAllTodos as jest.Mock).mockRejectedValue(error);

      await todoController.getAllTodosController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getTodoController', () => {
    it('should get a todo by ID for a user', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } } as unknown as Request;
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
      const todo = fakeTodos[0];

      (TodoService.getTodo as jest.Mock).mockResolvedValue(todo);

      await todoController.getTodoController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todo);
    });

    it('should handle invalid ID', async () => {
      const req = { params: {}, user: { userId: 'user123' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await todoController.getTodoController(req, res, next);

      expect(next).toHaveBeenCalledWith(new CustomError('This Id is invalid', 400));
    });

    it('should handle errors', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } } as unknown as Request;
        const res = {} as Response;
      const next = jest.fn() as NextFunction;
      const error = new Error('Internal Server Error');

      (TodoService.getTodo as jest.Mock).mockRejectedValue(error);

      await todoController.getTodoController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createTodoController', () => {
    it('should create a new todo for a user', async () => {
      const req = { body: { title: 'New Todo' }, user: { userId: 'user123' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
      const newTodo = fakeTodos[0];

      (TodoService.createTodo as jest.Mock).mockResolvedValue(newTodo);

      await todoController.createTodoController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTodo);
    });

    it('should handle invalid input', async () => {
        const req = { body: null, user: { userId: 'user123' } } as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;
      
        try {
          await todoController.createTodoController(req, res, next);
        } catch (error: any) {
          expect(error).toBeInstanceOf(CustomError);
          expect(error.message).toBe("Invalid input. Please provide input");
          expect(error.statusCode).toBe(400);
        }        
        expect(next).not.toHaveBeenCalled();
      });
    it('should handle errors', async () => {
      const req = { body: { title: 'New Todo' }, user: { userId: 'user123' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;
      const error = new Error('Internal Server Error');

      (TodoService.createTodo as jest.Mock).mockRejectedValue(error);

      await todoController.createTodoController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('deleteTodoController', () => {
    it('should delete a todo by ID for a user', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      await todoController.deleteTodoController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Todo deleted successfully!", status: 200 });
    });

    it('should handle invalid ID', async () => {
      const req = { params: {}, user: { userId: 'user123' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await todoController.deleteTodoController(req, res, next);

      expect(next).toHaveBeenCalledWith(new CustomError('ID must be provided', 400));
    });

    it('should handle unauthorized deletion', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;
      const error = new CustomError('Unauthorized: You are not allowed to delete this todo', 403);
      (TodoService.deleteTodo as jest.Mock).mockRejectedValue(error);
      await todoController.deleteTodoController(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle not found error', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;
      const error = new CustomError('Todo not found', 404);
      (TodoService.deleteTodo as jest.Mock).mockRejectedValue(error);
      await todoController.deleteTodoController(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe('updateTodoController', () => {
    it('should update a todo by ID for a user', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
      const updatedTodo = { id: 'todo123', title: 'Updated Todo', userId: 'user123' };

      (TodoService.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);

      await todoController.updateTodoController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

      it('should handle CustomError', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' }, body: {} } as unknown as Request;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        } as unknown as Response;
        const next = jest.fn() as NextFunction;
      
        const error = new CustomError('Test error message', 404);
        (TodoService.updateTodo as jest.Mock).mockRejectedValue(error);
      
        await todoController.updateTodoController(req, res, next);
      
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test error message' });
      });
      it('should call next with error', async () => {
        const req = { params: { id: 'todo123' }, user: { userId: 'user123' }, body: {} } as unknown as Request;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        } as unknown as Response;
        const next = jest.fn() as NextFunction;
      
        const error = new Error('Test error');
        (TodoService.updateTodo as jest.Mock).mockRejectedValue(error);
      
        await todoController.updateTodoController(req, res, next);
      
        expect(next).toHaveBeenCalledWith(error);
      });
      
  });