/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import {
  handleCastError,
  handleDuplicateError,
  handleValidationError,
  handleZodError,
} from "../helpers/globalErrorHelpers";
import { TErrorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  if (req.files && req.files.length) {
    const imgUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    await Promise.all(imgUrl.map((url) => deleteImageFromCloudinary(url)));
  }

  let statusCode = 500;
  let message = "Something Went Wrong";
  let errorSources: TErrorSources[] | undefined = [];

  // * duplicate error
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // * object id error
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // * handling ZodError
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  }
  // * mongoose validation error
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
