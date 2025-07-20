import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const message = error.message.match(/"([^"]*)"/)[1] + " already exist";

  return {
    message,
    statusCode: 400,
  };
};

export const handleCastError = () => {
  return {
    message: "Invalid Mongodb Object Id",
    statusCode: 400,
  };
};

export const handleValidationError = (
  error: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  const errors = Object.values(error.errors);

  errors.forEach((errorObj: any) =>
    errorSources.push({
      path: errorObj.path,
      message: errorObj.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export const handleZodError = (error: any) => {
  const errorSources: TErrorSources[] = [];
  error.issues.forEach((issue: any) => {
    errorSources.push({
      path:
        issue.path.length > 1
          ? issue.path.reverse().join(" inside ")
          : issue.path[0],
      message: issue.message,
    });
  });

  return {
    message: "Zod Error",
    statusCode: 400,
    errorSources,
  };
};
