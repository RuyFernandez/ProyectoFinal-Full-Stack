import { Usuario } from "../schemes/Usuarios.js";

export async function isAdmin(req, res, next) {
  try {
    const usuario = await Usuario.findById(req.userId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    if (usuario.role !== "admin") {
      return res.status(403).json({ error: "Acceso solo para administradores" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Error de autorización" });
  }
}
