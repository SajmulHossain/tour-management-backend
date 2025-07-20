import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const isExistDivision = await Division.findOne({ name: payload.name });

  if (isExistDivision) {
    throw new Error("A division with this name is already exist");
  }

  const slug = payload.name.toLocaleLowerCase().split(" ").join("-") + "-division";

  payload.slug = slug;
  const division = await Division.create(payload);
  return division;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isExistDivision = await Division.findById(id);

  if (!isExistDivision) {
    throw new Error("Division not found");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new Error("A division with this name is already exist");
  }

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updateDivision;
};

const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionServices = {
  updateDivision,
  deleteDivision,
  createDivision,
};
