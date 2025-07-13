import { NextFunction, Request, Response, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { validationRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(403, "No token recieved");
    }
    const verifiedToken = jwt.verify(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    if (authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are not permitted to access this route");
    }

    next();
  };

router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers);

export const UserRoutes = router;
