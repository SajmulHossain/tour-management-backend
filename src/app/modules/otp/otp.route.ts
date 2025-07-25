import { Router } from "express";
import { OtpController } from "./otp.controller";

const router = Router();

router.post("/send", OtpController.sendTop);
router.post("/verify", OtpController.verifyOtp);

export const OtpRoutes = router;
