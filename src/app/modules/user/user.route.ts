import { NextFunction, Request, Response, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { validationRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "",
  (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(403, "No token recieved");
    }
    const verifiedToken = jwt.verify(accessToken, "secret");

    if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
      throw new AppError(403, "You are not permitted to access this route");
    }

    next();
  },
  UserControllers.getAllUsers
);

export const UserRoutes = router;
