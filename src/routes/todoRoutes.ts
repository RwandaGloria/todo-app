import express from "express";
 const todoRoutes = express.Router();
import { TodoService } from "../services/todoService";
import { getAllTodosController, getTodoController, createTodoController, deleteTodoController } from "../controllers/TodoController";
import {validateGetAllTodos, validateGetTodo, validateCreateTodo, validateDeleteTodo} from "../middleware/validators"

todoRoutes.get("/", getAllTodosController );
todoRoutes.get("/:id", validateGetTodo, getTodoController);
todoRoutes.post("/", validateCreateTodo, createTodoController);
todoRoutes.delete("/:id", validateDeleteTodo, deleteTodoController);
export default todoRoutes