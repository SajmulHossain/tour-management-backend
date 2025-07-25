/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created Successfully",
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User created Successfully",
    //   user,
    // });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
      success: true,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user as JwtPayload;
    const user = await UserServices.updateUser(userId, req.body, verifiedToken);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: user,
      success: true,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data, meta } = await UserServices.getAllUser();

    res.status(httpStatus.OK).json({
      success: true,
      message: "All users retrived successfully",
      data,
      meta,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const me = await UserServices.getMe(decodedToken.userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "User retrived successfully",
      data: me
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
};

// * routing matching -> controllers -> service -> model -> DB
