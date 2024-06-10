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
  