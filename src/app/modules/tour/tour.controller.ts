import { Request, Response } from "express";

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

const getAllTours = async (req: Request, res: Response) => {
  console.log(req, res);
  
};

export const TourControllers = {
  createTourType,
  updateTourType,
  deleteTourType,
  getAllTours,
  getAllTourTypes,
};
