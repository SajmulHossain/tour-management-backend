import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookies";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialLogin(req.body);

  setAuthCookie(res, loginInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User Logged In Successfully",
    data: loginInfo,
    success: true,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No refresh token found");
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Token Refreshed Successfully",
    data: tokenInfo,
    success: true,
  });
});

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
};
