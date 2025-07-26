import mongoose from "mongoose";
import { LibrosModel } from "../../schemes/Libros.js";

const conectionMongoDB = process.env.MONGODB_URI;

mongoose
  .connect(conectionMongoDB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

export default class Libros {
  
  static async getLibros() {
    return await LibrosModel.find({});
  }

  static async getLibrosFilter(filters = {}) {
    const query = {};
  
    const camposParaFiltrar = [
      "title", "author", "genre", "description",
      "publisher", "published_year", "pages"
    ];
  
    const camposDeOrden = {
      orderBy: { title: 1 },
      rating: { rating: -1 }
    };
  
    // Construir query sin incluir campos de orden
    for (const [key, value] of Object.entries(filters)) {
      if (!camposParaFiltrar.includes(key)) continue;
  
      if (key === "genre") {
        if (Array.isArray(value) && value.length > 0) {
          query[key] = { $in: value };
        } else if (typeof value === "string" && value.trim() !== "") {
          query[key] = { $in: [value] };
        }
      } else if (["title", "author", "publisher"].includes(key)) {
        query[key] = { $regex: value, $options: "i" };
      } else if (["pages", "published_year"].includes(key)) {
        const num = parseInt(value);
        if (!isNaN(num)) query[key] = num;
      } else {
        query[key] = value;
      }
    }
  
    // Ejecutar la búsqueda
    let queryResult = LibrosModel.find(query);
  
    // Ordenar según filtros de orden
    if (filters.orderBy === true || filters.orderBy === 'true') {
      queryResult = queryResult.sort(camposDeOrden.orderBy);
    } else if (filters.rating === true || filters.rating === 'true') {
      queryResult = queryResult.sort(camposDeOrden.rating);
    }
  
    const libros = await queryResult.exec();
  
    // Datos extras
    const [generosRaw, autoresRaw, editorialesRaw, idiomasRaw] = await Promise.all([
      LibrosModel.aggregate([
        { $unwind: "$genre" },
        { $group: { _id: null, generosDisponibles: { $addToSet: "$genre" } } },
        { $project: { _id: 0, generosDisponibles: 1 } }
      ]),
      LibrosModel.aggregate([
        { $group: { _id: null, autoresDisponibles: { $addToSet: "$author" } } },
        { $project: { _id: 0, autoresDisponibles: 1 } }
      ]),
      LibrosModel.aggregate([
        { $group: { _id: null, editorialesDisponibles: { $addToSet: "$publisher" } } },
        { $project: { _id: 0, editorialesDisponibles: 1 } }
      ]),
      LibrosModel.aggregate([
        { $group: { _id: null, idiomasDisponibles: { $addToSet: "$language" } } },
        { $project: { _id: 0, idiomasDisponibles: 1 } }
      ])
    ]);
  
    return {
      libros,
      generosDisponibles: generosRaw[0]?.generosDisponibles || [],
      autoresDisponibles: autoresRaw[0]?.autoresDisponibles || [],
      editorialesDisponibles: editorialesRaw[0]?.editorialesDisponibles || [],
      idiomasDisponibles: idiomasRaw[0]?.idiomasDisponibles || []
    };
  }
  

  static async createLibro(data) {
    const { title, author } = data;
    const libroExistente = await LibrosModel.findOne({
      title: new RegExp(`^${title}$`, "i"),
      author: new RegExp(`^${author}$`, "i")
    });
  
    if (libroExistente) {
      const error = new Error("El libro ya existe en la base de datos");
      error.code = 409;
      throw error;
    }
  
    const newLibro = new LibrosModel(data);
    return await newLibro.save();
  }

  static async updateLibro(data, id) {
    return await LibrosModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  static async replaceLibro(data, id) {
    return await LibrosModel.replaceOne({ _id: id }, data);
  }

  static async deleteLibro(id) {
    return await LibrosModel.deleteOne({ _id: id });
  }
}