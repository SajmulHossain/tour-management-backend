import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatesServices } from "./states.service";

const user = catchAsync(async(req: Request, res: Response) => {
    const user = await StatesServices.user();

    sendResponse(res, {
        success: true,
        data: user,
        message: "User states retrived successfully",
        statusCode: 200
    })
})

const payment = catchAsync(async(req: Request, res: Response) => {
    const payment = await StatesServices.payment();

    sendResponse(res, {
        success: true,
        data: payment,
        message: "User states retrived successfully",
        statusCode: 200
    })
})

const booking = catchAsync(async(req: Request, res: Response) => {
    const booking = await StatesServices.booking();

    sendResponse(res, {
        success: true,
        data: booking,
        message: "User states retrived successfully",
        statusCode: 200
    })
})

const tour = catchAsync(async(req: Request, res: Response) => {
    const tour = await StatesServices.tour();

    sendResponse(res, {
        success: true,
        data: tour,
        message: "User states retrived successfully",
        statusCode: 200
    })
})

export const StatesController = {
  user,
  booking,
  payment,
  tour,
};