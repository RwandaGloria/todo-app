interface CustomErrorInterface extends Error {
    message: string;
    statusCode: number;
  }
  
  export class CustomError extends Error implements CustomErrorInterface {
    message: string;
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.message = message;
      this.statusCode = statusCode;
    }
  }

  export interface Todo {
    id: string;
    description: string;
    title: string;
    isCompleted: boolean;
    userId: string; 
  }

  export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}
  