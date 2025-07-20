import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    let slug = this.name.toLocaleLowerCase().split(" ").join("-") + "-division";

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${++counter}`;
    }

    this.slug = slug;
  }

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
