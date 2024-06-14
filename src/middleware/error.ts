import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/types";
import logger from "../utils/logger";


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    // logger.error(`${err.message}\n${err.stack}`);
    return res.status(err.statusCode).json({ message: err.message || "Please try again later" });
  }
  
  const error = err as Error;
  logger.error(`${error.message}\n${error.stack}`);
  return res.status(500).json({ message: "Server error occurred. Please try again later" });
}
  