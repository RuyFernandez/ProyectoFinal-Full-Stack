import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../schemes/Usuarios.js";

const JWT_SECRET = process.env.JWT_SECRET || "secreto";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const existe = await Usuario.findOne({ $or: [{ username }, { email }] });
    if (existe)
      return res.status(400).json({ error: "El usuario o email ya existe" });

    const hashed = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ username, email, password: hashed });
    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    res.status(500).json({ error: "Error en el registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password)
      return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const user = await Usuario.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) return res.status(404).json({ error: "No encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error en el login" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await Usuario.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "No encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};