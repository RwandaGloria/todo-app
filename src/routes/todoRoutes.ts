import express from "express";
 const todoRoutes = express.Router();
import { TodoService } from "../services/todoService";
import { getAllTodosController, getTodoController, createTodoController, deleteTodoController, updateTodoController } from "../controllers/TodoController";
import {validateGetAllTodos, validateGetTodo, validateCreateTodo, validateDeleteTodo, validateUpdateTodo} from "../middleware/validators"

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Enter your Bearer token
 *
 * @swagger
 * swagger: '3.1.0'
 * /api/v1/user/todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a list of all todos for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
todoRoutes.get("/", getAllTodosController );
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The ID of the todo item
 *         title:
 *           type: string
 *           description: The title of the todo item
 *         description:
 *           type: string
 *           description: The description of the todo item
 *         isCompleted:
 *           type: boolean
 *           description: The completion status of the todo item
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the todo item
 *       required:
 *         - id
 *         - title
 *         - description
 *         - isCompleted
 *         - userId
 * 
 * /api/v1/user/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     description: Retrieve a todo item by its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo item to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A single todo item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '404':
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
todoRoutes.get("/:id", validateGetTodo, getTodoController);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The ID of the todo item
 *         title:
 *           type: string
 *           description: The title of the todo item
 *         description:
 *           type: string
 *           description: The description of the todo item
 *         isCompleted:
 *           type: boolean
 *           description: The completion status of the todo item
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the todo item
 *       required:
 *         - title
 *         - description
 *         - userId
 *
 * /api/v1/user/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo item for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the todo item
 *               description:
 *                 type: string
 *                 description: The description of the todo item
 *             required:
 *               - title
 *               - description
 *     responses:
 *       '201':
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
todoRoutes.post("/", validateCreateTodo, createTodoController);
/**
 * @swagger
 * /api/v1/user/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     description: Delete a todo item by its unique ID for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo item to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo deleted successfully!"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Request Parameters"
 *       '403':
 *         description: Unauthorized action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: You are not allowed to delete this todo"
 *       '404':
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error occurred. Please try again later"
 */
todoRoutes.delete("/:id", validateDeleteTodo, deleteTodoController);
/**
 * @swagger
 * /api/v1/user/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     description: Update a todo item by its unique ID for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo item to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the todo
 *                 example: "Updated Title"
 *               description:
 *                 type: string
 *                 description: The description of the todo
 *                 example: "Updated Description"
 *               isCompleted:
 *                 type: boolean
 *                 description: The completion status of the todo
 *                 example: true
 *             oneOf:
 *               - required: [title]
 *               - required: [description]
 *               - required: [isCompleted]
 *     responses:
 *       '200':
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   example: "Updated Title"
 *                 description:
 *                   type: string
 *                   example: "Updated Description"
 *                 isCompleted:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   example: "user123e4567-e89b-12d3-a456-426614174000"
 *       '400':
 *         description: Invalid request parameters or body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Request Body: At least one of title, description, or isCompleted must be provided"
 *       '401':
 *         description: Unauthorized action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token not provided"
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is invalid"
 *       '404':
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error occurred. Please try again later"
 */
todoRoutes.put("/:id", validateUpdateTodo, updateTodoController);
export default todoRoutes