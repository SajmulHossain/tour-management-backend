/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { clearAuthCookies, setAuthCookie } from "../../utils/setCookies";
import { createUserToken } from "../../utils/userToken";
import { AuthServices } from "./auth.service";
import passport from "passport";
import { envVars } from "../../config/env.config";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialLogin(req.body);
    passport.authenticate("local", async (err: any, user: any) => {
      if (err) {
        // return new AppError(401, err);
        // return next(err);

        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, err));
      }

      const userToken = createUserToken(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userToken);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
        success: true,
      });
    })(req, res, next);
  }
);

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

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  console.log(req, res);
});
const setPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { password } = req.body;

  await AuthServices.setPassword(decodedToken.userId, password);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password Changed Successfully",
    data: null,
  });
});

const googleCallBackController = catchAsync(
  async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  resetPassword,
  credentialLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleCallBackController,
  setPassword,
};
