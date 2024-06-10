import express from "express";
 const todoRoutes = express.Router();
import { TodoService } from "../services/todoService";
import { getAllTodosController } from "../controllers/TodoController";
import {validateGetAllTodos} from "../middleware/validators"

todoRoutes.get("/todos", validateGetAllTodos, getAllTodosController );

export default todoRoutes