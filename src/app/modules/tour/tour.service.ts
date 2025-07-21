import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
  const isExistTour = await Tour.findOne({ title: payload.title });
  if (isExistTour) {
    throw new Error("A tour with title already exists");
  }

  const tour = await Tour.create(payload);

  return tour;
};

export const TourServices = {
  createTour,
};
