import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.service";

const createTourType = async (req: Request, res: Response) => {
  console.log(req, res);
};
const getAllTourTypes = async (req: Request, res: Response) => {
  console.log(req, res);
};
const updateTourType = async (req: Request, res: Response) => {
  console.log(req, res);
};
const deleteTourType = async (req: Request, res: Response) => {
  console.log(req, res);
};

// * <----------- Tour Controllers -------------->
const createTour = async (req: Request, res: Response) => {
  const tour = await TourServices.createTour(req.body);

  sendResponse(res, {
    data: tour,
    success: true,
    message: "Tour created Successfully",
    statusCode: 201,
  });
};

const updateTour = 

export const TourControllers = {
  createTourType,
  updateTourType,
  deleteTourType,
  getAllTourTypes,
  createTour,
  updateTour
};
