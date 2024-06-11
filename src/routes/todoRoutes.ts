import express from "express";
 const todoRoutes = express.Router();
import { TodoService } from "../services/todoService";
import { getAllTodosController, getTodoController, createTodoController, deleteTodoController, updateTodoController } from "../controllers/TodoController";
import {validateGetAllTodos, validateGetTodo, validateCreateTodo, validateDeleteTodo, validateUpdateTodo} from "../middleware/validators"

todoRoutes.get("/", getAllTodosController );
todoRoutes.get("/:id", validateGetTodo, getTodoController);
todoRoutes.post("/", validateCreateTodo, createTodoController);
todoRoutes.delete("/:id", validateDeleteTodo, deleteTodoController);
todoRoutes.put("/:id", validateUpdateTodo, updateTodoController);
export default todoRoutes