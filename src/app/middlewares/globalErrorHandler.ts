import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something Went Wrong";

  // * duplicate error
  if (error.code === 11000) {
    message = error.message.match(/"([^"]*)"/)[1] + " already exist";
    statusCode = 400;
  }
  // * object id error
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid mongodb object id";
  }
  // * validation error
  else if(error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error occured"
  }
   else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
