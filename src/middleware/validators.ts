import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/types";

export const validateGetAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
      userId: Joi.string().uuid().required(),
    });
    const { error } = await schema.validate(req.body);
  
    if (error) {
     return next(new CustomError(error.details[0].message, 400));
    }
    next();
  };


export const validateGetTodo = async (req: Request, res: Response, next: NextFunction) => {
  const getTodoSchema = Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.base': 'ID must be a string',
      'string.empty': 'ID cannot be empty',
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required',
    }),
    })

  const { error } = getTodoSchema.validate(req.params);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  next();
};


export const validateCreateTodo = async (req: Request, res: Response, next: NextFunction) => {
  const createTodoSchema = Joi.object().keys({
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("Description"),
  });
  
  const { error } = await createTodoSchema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  next();
};

export const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  next();
};

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  next();
};

export const validateDeleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  const deleteTodoSchema = Joi.object({
    id: Joi.string().guid().required()
  });

  const { error } = deleteTodoSchema.validate(req.params);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  next();
};
