import mongoose from "mongoose";

const librosScheme = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    genre: [{ type: String }],
    description: { type: String },
    publisher: { type: String },
    published_year: { type: Number },
    pages: { type: Number },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

librosScheme.set("toJSON", {
  transform: (doc, returnObject) => {
    returnObject.id = doc._id;
    delete returnObject._id;
    delete returnObject.createdAt;
    delete returnObject.updatedAt;
  }
});

export const LibrosModel = mongoose.model("Libro", librosScheme);
