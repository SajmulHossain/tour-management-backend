import { NextFunction, Request, Response, Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import { validationRequest } from "../../middlewares/validateRequest";
import { changePasswordZodSchema } from "../user/user.validation";
import passport from "passport";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallBackController
);

export const AuthRoutes = router;
