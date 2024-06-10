import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/Error";

export const validateGetAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
      userId: Joi.string().uuid().required(),
    });
    console.log("Im here")
    const { error } = await schema.validate(req.body);
  
    if (error) {
      next(new CustomError(error.details[0].message, 400));
    }
    next();
  };
  