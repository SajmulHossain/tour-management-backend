import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { clearAuthCookies, setAuthCookie } from "../../utils/setCookies";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";

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

const logout = catchAsync(async (req: Request, res: Response) => {
  clearAuthCookies(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Logged Out Successfully",
    data: null,
    success: true,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const { oldPassword, newPassword } = req.body;

  await AuthServices.changePassword(oldPassword, newPassword, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password Changed Successfully",
    data: null,
    success: true,
  });
});

const googleCallBackController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  console.log(user);

  if(!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  
  const tokenInfo = createUserToken(user)
  setAuthCookie(res, tokenInfo);

  res.redirect("https://sajmul.com");
});

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleCallBackController
};
