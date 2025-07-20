import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"


const getAllDivision = (req: Request, res: Response) => {

        sendResponse(res, {
          statusCode: 201,
          data: null,
          message: "",
          success: true,
        });
}

const createDivision = (req: Request, res: Response) => {



    sendResponse(res, {
        statusCode: 201,
        data: null,
        message: '',
        success: true
    })
}

export const DivisionControllers = {
    createDivision, getAllDivision
}