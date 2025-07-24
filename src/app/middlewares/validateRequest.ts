import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validationRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data) || req.body;
    req.body = await zodSchema.parseAsync(req.body);
    next();
  };
