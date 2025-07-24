import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.service";

const getAllDivisions = async (req: Request, res: Response) => {
  const { data, meta } = await DivisionServices.getAllDivisions(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 201,
    data,
    meta,
    message: "Division Retrived Successfully",
    success: true,
  });
};

const getSingleDivision = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const division = await DivisionServices.getSingleDivision(slug);

  sendResponse(res, {
    statusCode: 201,
    data: division,
    message: "Division Retrived Successfully",
    success: true,
  });
};

const createDivision = async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    thumbnail: req.file?.path,
  };

  const division = await DivisionServices.createDivision(payload);

  sendResponse(res, {
    statusCode: 201,
    data: division,
    message: "Divison Created",
    success: true,
  });
};

const updateDivision = async (req: Request, res: Response) => {
  const { id } = req.params;

    const payload = {
      ...req.body,
      thumbnail: req.file?.path,
    };
  const division = await DivisionServices.updateDivision(id, payload);

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
  getAllDivisions,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
