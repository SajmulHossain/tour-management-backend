import { Router } from "express";
import { validationRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("", UserControllers.getAllUsers);

export const UserRoutes = router;
