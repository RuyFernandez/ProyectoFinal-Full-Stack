import { Router } from "express";
import { Libros } from "../controllers/Libros.js";
import { verificarToken } from "../middlewares/ValidarToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import mongoose from "mongoose";

export const routeForLibros = Router();

export function LibrosRoute(model) {
  const librosController = new Libros(model);

  //--------------- Get con filtros y extras ---------------//
  routeForLibros.get('/', async (req, res) => {
    try {
      if (Object.keys(req.query).length > 0) {
        const result = await librosController.getLibrosFilter(req.query);
        return res.json(result);
      }

      const libros = await librosController.getLibros();
      res.json({ libros });
    } catch (error) {
      console.error('Error al obtener libros:', error);
      res.status(500).json({ error: 'Error al obtener los libros' });
    }
  });

  //--------------- Post ---------------//
  routeForLibros.post('/', verificarToken, isAdmin, async (req, res) => {
    try {
      const newLibro = await librosController.createLibro(req.body);
      res.status(201).json(newLibro);
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({ error: error.message });
      }
      console.error("Error al crear libro:", error);
      res.status(500).json({ error: "Error interno al crear el libro" });
    }
  });

  //--------------- Put ---------------//
  routeForLibros.put('/:id', verificarToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const updatedLibro = await librosController.replaceLibro(req.body, id);
    res.json(updatedLibro);
  });

  //--------------- Patch ---------------//
  routeForLibros.patch('/:id', verificarToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const updatedLibro = await librosController.updateLibroforId(req.body, id);
      res.json(updatedLibro);
    } catch (error) {
      console.error("Error al hacer PATCH:", error);
      res.status(500).json({ error: "Error al actualizar el libro" });
    }
  });

  //--------------- Delete ---------------//
  routeForLibros.delete('/:id', verificarToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const deletedLibro = await librosController.deleteLibro(id);
    res.json(deletedLibro);
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  });

  return routeForLibros;
}
