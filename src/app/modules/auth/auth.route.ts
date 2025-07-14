import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import { validationRequest } from "../../middlewares/validateRequest";
import { changePasswordZodSchema } from "../user/user.validation";

const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validationRequest(changePasswordZodSchema),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
