import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Por favor ingresa un email válido"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    likedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Libro" }],
    dislikedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Libro" }],
    readBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Libro" }],
    toReadBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Libro" }],
  },
  {
    timestamps: true,
  }
);

usuarioSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const Usuario = mongoose.model("Usuario", usuarioSchema);
