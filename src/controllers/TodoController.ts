import { NextFunction, Request, Response } from "express";
import { TodoService } from "../services/todoService";
import { CustomError } from "../types/types";

export const getAllTodosController = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const userId = req.user.userId
    if (!userId) {
        throw new CustomError("No todos found", 404);
      }
      const todos = await TodoService.getAllTodos(userId);
      return res.status(200).json(todos);
    }
    catch(err) {
        next(err)
    }
  };
  export const  getTodoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const id = req.params.id;
    if (!id) {
        throw new CustomError("This Id is invalid", 400);
    }
    const todo = await TodoService.getTodo(id);
    return res.status(200).json(todo);
  }
catch(err) 
{
    next(err);
}
  }
  export const createTodoController = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const userId = req.user.userId
    if (!body) {
        throw new CustomError("Invalid input. Please provide input", 400);
    }
    const todoWithUserId = { ...body, userId };
    try {
        const newTodo = await TodoService.createTodo(todoWithUserId);
        return res.status(201).json(newTodo);
    } catch (error) {
      
        next(error)
    }
};
export const deleteTodoController = async (req: Request, res: Response, next: NextFunction) => 
{
  try {
  const id = req.params.id;
  if (!id) {
    throw new CustomError("ID must be provided", 400)
  }
  const userId = req.user.userId;
  await TodoService.deleteTodo(id, userId);
  return res.status(200).json({ message: "Todo deleted successfully!", status: 200});

  }
  catch(err) {
    next(err)
  }
}


  
  
  