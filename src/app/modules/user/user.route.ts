import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
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
router.get("", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
router.patch("/:id", checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const UserRoutes = router;
