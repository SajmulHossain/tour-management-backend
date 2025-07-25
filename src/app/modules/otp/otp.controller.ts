import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OtpServices } from "./otp.service";

const sendTop = catchAsync(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  await OtpServices.sendTop(email, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Sent Successfully",
    data: null,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await OtpServices.verifyOtp(email, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Verifed Successfully",
    data: null,
  });
});

export const OtpController = {
  sendTop,
  verifyOtp,
};
