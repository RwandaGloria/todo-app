import Express from "express";
export const route = Express.Router();
import  todoRoutes  from "./todoRoutes";
route.use("/user", todoRoutes)