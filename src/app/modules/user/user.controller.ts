/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

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

export const UserControllers = {
  createUser,
  getAllUsers,
};

// * routing matching -> controllers -> service -> model -> DB
