import { Request, Response } from "express";
import { TodoService } from "../services/todoService";
import { CustomError } from "../types/Error";

export const getAllTodosController = async (req: Request, res: Response) => {
    const userId = req.body.userId
    if (!userId) {
        throw new CustomError("No todos found", 404);
      }
      

      const todos = await TodoService.getAllTodos(userId);
      return res.status(200).json(todos);

  };
  
  