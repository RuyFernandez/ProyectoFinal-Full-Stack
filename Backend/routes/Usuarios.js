import express from "express";
import {  marcarLibro, getLikedBooks, getDislikedBooks, getReadBooks, getToReadBooks } from "../controllers/Usuarios.js";
import { verificarToken } from "../middlewares/ValidarToken.js";

const router = express.Router();

router.post("/marcar/:libroId", verificarToken, marcarLibro);

// Endpoints para obtener listas de libros del usuario autenticado
router.get("/liked", verificarToken, getLikedBooks);
router.get("/disliked", verificarToken, getDislikedBooks);
router.get("/read", verificarToken, getReadBooks);
router.get("/toread", verificarToken, getToReadBooks);

export default router;