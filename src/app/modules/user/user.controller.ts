/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
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

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
      const user = await UserServices.createUser(req.body);

      res.status(httpStatus.CREATED).json({
        message: "User created Successfully",
        user,
      });
})


const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserServices.getAllUser();

    return users;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserControllers = {
  createUser,
  getAllUsers,
};

// * routing matching -> controllers -> service -> model -> DB
