import { IDivision } from "./division.interface";
import { Division } from "./division.model";

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

const deleteDivision = async(id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
}

export const DivisionServices = {
  updateDivision,
  deleteDivision
};
