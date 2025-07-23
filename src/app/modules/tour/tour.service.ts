import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// const getAllTour = async (query: Record<string, string>) => {
//   const filter = query;
//   const search = query.search || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   for (const field of excludeFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: search, $options: "i" },
//     })),
//   };

//   // const tours = await Tour.find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(skip)
//   //   .limit(limit);

//   const filterQuery = Tour.find(filter);
//   const allTour = filterQuery.find(searchQuery);
//   const tours = await allTour.sort(sort).select(fields).skip(skip).limit(limit)

//   const totalTours = await Tour.countDocuments()
//     // .countDocuments(filter)
//     // .skip(skip)
//     // .limit(limit);

//     const totalPage = Math.ceil(totalTours/limit)

//     const meta = {
//       page,
//       limit,
//       skip,
//       totalPage,
//       total: totalTours
//     }
//   return {
//     tours,
//     meta
//   };
// };

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = queryBuilder
    .filter()
    .search(tourSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const createTour = async (payload: ITour) => {
  const isExistTour = await Tour.findOne({ title: payload.title });
  if (isExistTour) {
    throw new Error("A tour with title already exists");
  }

  const tour = await Tour.create(payload);

  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isExistTour = await Tour.findById(id);

  if (!isExistTour) {
    throw new AppError(400, "Tour not found");
  }

  const tour = await Tour.findByIdAndUpdate(id, payload, {
    runValidators: true,
    new: true,
  });

  return tour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

// * -----tour types --------
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create(payload);
};

const getAllTourTypes = async () => {
  return await TourType.find();
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourServices = {
  createTour,
  updateTour,
  deleteTour,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  getAllTour,
  createTourType,
};
