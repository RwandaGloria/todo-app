
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { CustomError } from "../types/types";

export const signUpController = async (req: Request, res: Response, next:NextFunction ) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const userObj = await UserService.signUp({ firstName, lastName, email, password });
      if(!userObj) {
        throw new CustomError("Unable to signup user. Please try again later.", 500)
      }
    
      return res.status(201).json({
        status: 201,
        userObj
      });
    }
    catch(err) {
        next(err)
    }
  };
  export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { findUser, token } = await UserService.login(email, password);
        if (!findUser) {
            throw new CustomError("Unable to login user. Please try again later", 500);
        }
        const userWithoutPassword = {
            id: findUser.id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: findUser.email,
        };
        return res.status(200).json({
            status: 200,
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error);
    }
};