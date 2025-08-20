import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    tourType: { type: Schema.Types.ObjectId, required: true, ref: "TourType" },
    division: { type: Schema.Types.ObjectId, required: true, ref: "Division" },
    maxGuest: { type: Number },
    minAge: { type: Number },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
  },
  { timestamps: true, versionKey: false }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let slug = this.title.toLocaleLowerCase().split(" ").join("-");

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${++counter}`;
    }

    this.slug = slug;
  }

  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    let slug = tour.title.toLocaleLowerCase().split(" ").join("-");

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${++counter}`;
    }

    tour.slug = slug;
  }

  this.setUpdate(tour);

  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
