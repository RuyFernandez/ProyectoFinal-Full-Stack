import { Usuario } from "../schemes/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function registrarUsuario(req, res) {
  const { username, email, password } = req.body;

  try {
    const existe = await Usuario.findOne({ $or: [{ email }, { username }] });
    if (existe) {
      return res.status(400).json({ error: "Usuario o email ya registrados" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      username,
      email,
      password: hashedPassword,
    });

    await nuevoUsuario.save();

    const token = jwt.sign({ userId: nuevoUsuario._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ mensaje: "Usuario creado correctamente", token });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

export async function loginUsuario(req, res) {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: usuario._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ mensaje: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

export async function marcarLibro(req, res) {
  const { libroId } = req.params;
  const { accion } = req.body;
  const userId = req.userId;

  const accionesValidas = ["like", "dislike", "read", "toRead"];
  if (!accionesValidas.includes(accion)) {
    return res.status(400).json({ error: "Acción inválida" });
  }

  const campos = {
    like: "likedBooks",
    dislike: "dislikedBooks",
    read: "readBooks",
    toRead: "toReadBooks",
  };

  try {
    const usuario = await Usuario.findById(userId);
    const campo = campos[accion];

    if (usuario[campo].includes(libroId)) {
      usuario[campo] = usuario[campo].filter(id => id.toString() !== libroId);
    } else {
      usuario[campo].push(libroId);
    }

    await usuario.save();
    res.json({ mensaje: `Libro actualizado en ${campo}` });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar preferencia" });
  }
}

// Obtener libros "me gusta" del usuario autenticado
export async function getLikedBooks(req, res) {
  try {
    const usuario = await Usuario.findById(req.userId).populate('likedBooks');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ likedBooks: usuario.likedBooks });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros me gusta' });
  }
}

// Obtener libros "no me gusta" del usuario autenticado
export async function getDislikedBooks(req, res) {
  try {
    const usuario = await Usuario.findById(req.userId).populate('dislikedBooks');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ dislikedBooks: usuario.dislikedBooks });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros no me gusta' });
  }
}

// Obtener libros "leídos" del usuario autenticado
export async function getReadBooks(req, res) {
  try {
    const usuario = await Usuario.findById(req.userId).populate('readBooks');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ readBooks: usuario.readBooks });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros leídos' });
  }
}

// Obtener libros "ver más tarde/pendiente" del usuario autenticado
export async function getToReadBooks(req, res) {
  try {
    const usuario = await Usuario.findById(req.userId).populate('toReadBooks');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ toReadBooks: usuario.toReadBooks });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros pendientes' });
  }
}