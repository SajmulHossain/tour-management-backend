import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from './auth.service';

const credentialLogin = catchAsync(
  async (req: Request, res: Response) => {
    const loginInfo = await AuthServices.credentialLogin(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
      success: true,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: tokenInfo,
      success: true,
    });
  }
);

export const AuthControllers = {
    credentialLogin,
    getNewAccessToken
}