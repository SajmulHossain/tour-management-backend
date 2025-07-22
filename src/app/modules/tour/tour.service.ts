import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
  const isExistTour = await Tour.findOne({ title: payload.title });
  if (isExistTour) {
    throw new Error("A tour with title already exists");
  }

  // let slug = payload.title.toLocaleLowerCase().split(" ").join("-") + "-tour";

  // let counter = 0;
  // while (await Tour.exists({ slug })) {
  //   slug = `${slug}-${++counter}`;
  // }

  // payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

export const TourServices = {
  createTour,
};
