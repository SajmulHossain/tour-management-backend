import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
  const isExistTour = await Tour.findOne({ title: payload.title });
  if (isExistTour) {
    throw new Error("A tour with title already exists");
  }

  let slug =
    payload.title.toLocaleLowerCase().split(" ").join("-") + "-division";

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${++counter}`;
  }
  payload.slug = slug;

  return null;
};

export const TourServices = {
  createTour,
};
