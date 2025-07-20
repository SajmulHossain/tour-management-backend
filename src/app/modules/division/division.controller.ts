import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.service";

const getAllDivision = (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 201,
    data: null,
    message: "",
    success: true,
  });
};

const createDivision = async (req: Request, res: Response) => {
  const division  = await DivisionServices.createDivision(req.body);
  
  sendResponse(res, {
    statusCode: 201,
    data: division,
    message: "",
    success: true,
  });
};

const updateDivision = async (req: Request, res: Response) => {
  const { id } = req.params;
  const division = await DivisionServices.updateDivision(id, req.body);

  sendResponse(res, {
    data: division,
    message: "Division Updated Successfully",
    statusCode: 201,
    success: true,
  });
};

const deleteDivision = async (req: Request, res: Response) => {
  const { id } = req.params;
  await DivisionServices.deleteDivision(id);
  
  sendResponse(res, {
    statusCode: 201,
    data: null,
    message: "Division Deleted Successfully",
    success: true,
  });
};

export const DivisionControllers = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
};
