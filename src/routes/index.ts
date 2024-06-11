import Express from "express";
export const route = Express.Router();
import  todoRoutes  from "./todoRoutes";
import { userRoutes } from "./userRoutes";
import { authenticateToken } from "../middleware/auth";
route.use("/user/todos", authenticateToken, todoRoutes)
route.use("/user", userRoutes)