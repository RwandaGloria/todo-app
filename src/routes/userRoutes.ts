import express from "express";
export const userRoutes = express.Router();
import { validateSignUp, validateLogin } from "../middleware/validators";
import { loginController, signUpController } from "../controllers/userController";

userRoutes.post("/signup", validateSignUp, signUpController);
userRoutes.post("/login", validateLogin, loginController)
