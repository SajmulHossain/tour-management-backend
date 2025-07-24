import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.service";

const createTourType = async (req: Request, res: Response) => {
  const tourType = await TourServices.createTourType(req.body);

  sendResponse(res, {
    data: tourType,
    success: true,
    message: "Tour type created successfully",
    statusCode: 201,
  });
};

const getAllTourTypes = async (req: Request, res: Response) => {
  const tourTypes = await TourServices.getAllTourTypes();

  sendResponse(res, {
    data: tourTypes,
    success: true,
    message: "All tour types retrived successfully",
    statusCode: 200,
  });
};

const updateTourType = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tourType = await TourServices.updateTourType(id, req.body);

  sendResponse(res, {
    data: tourType,
    success: true,
    message: "Tour type updated successfully",
    statusCode: 201,
  });
};

const deleteTourType = async (req: Request, res: Response) => {
  const { id } = req.params;
  await TourServices.deleteTourType(id);

  sendResponse(res, {
    data: null,
    success: true,
    message: "Tours type deleted successfully",
    statusCode: 200,
  });
};

// * <----------- Tour Controllers -------------->
const getAllTour = async (req: Request, res: Response) => {
  const query = req.query;
  const { data, meta } = await TourServices.getAllTour(
    query as Record<string, string>
  );

  sendResponse(res, {
    data,
    meta,
    success: true,
    message: "All Tours retrived successfully",
    statusCode: 200,
  });
};

const createTour = async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map((file) => file.path),
  };

  const tour = await TourServices.createTour(payload);

  sendResponse(res, {
    data: tour,
    success: true,
    message: "Tour created Successfully",
    statusCode: 201,
  });
};

const updateTour = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tour = await TourServices.updateTour(id, req.body);

  sendResponse(res, {
    data: tour,
    success: true,
    message: "Tour updated successfully",
    statusCode: 201,
  });
};

const deleteTour = async (req: Request, res: Response) => {
  const { id } = req.params;
  await TourServices.deleteTour(id);

  sendResponse(res, {
    data: null,
    success: true,
    message: "Tour deleted successfully",
    statusCode: 200,
  });
};

export const TourControllers = {
  createTourType,
  updateTourType,
  deleteTourType,
  getAllTourTypes,
  createTour,
  updateTour,
  getAllTour,
  deleteTour,
};
