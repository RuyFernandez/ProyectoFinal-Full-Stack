import express from "express";
import { register, login, getMe } from "../controllers/Auth.js";
import { verificarToken } from "../middlewares/ValidarToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verificarToken, getMe);

export default router;