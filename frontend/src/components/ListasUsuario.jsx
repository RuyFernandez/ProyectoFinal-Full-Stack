import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const endpoints = [
  { key: "likedBooks", label: "Me gusta", path: "liked", className: "liked" },
  { key: "dislikedBooks", label: "No me gusta", path: "disliked", className: "disliked" },
  { key: "readBooks", label: "Leídos", path: "read", className: "read" },
  { key: "toReadBooks", label: "Pendientes", path: "toread", className: "pending" }
];

const actionMap = {
  likedBooks: "like",
  dislikedBooks: "dislike",
  readBooks: "read",
  toReadBooks: "toRead"
};

export default function ListasUsuario() {
  const { user } = useContext(AuthContext);
  const [listas, setListas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    Promise.all(
      endpoints.map(async ({ key, path }) => {
        const res = await fetch(`http://localhost:3010/usuarios/${path}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Error al obtener ${key}`);
        const data = await res.json();
        return { key, libros: data[key] || data[Object.keys(data)[0]] || [] };
      })
    )
      .then((results) => {
        const obj = {};
        results.forEach(({ key, libros }) => {
          obj[key] = libros;
        });
        setListas(obj);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div>Inicia sesión para ver tus listas de libros.</div>;
  if (loading) return <div>Cargando listas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h2>Mis listas de libros</h2>
      {endpoints.map(({ key, label }) => (
        <div key={key} className="book-list">
          <h3 className={`book-list-label ${endpoints.find(e => e.key === key)?.className || ''}`}>
            {label}
          </h3>
          {listas[key]?.length ? (
            <ul>
              {listas[key].map((libro) => (
                <li key={libro._id || libro.id} className="book-item">
                  <strong>{libro.title}</strong> {libro.author && `- ${libro.author}`}
                  <button className="button-delete" onClick={async () => {
                    const token = localStorage.getItem("token");
                    try {
                      await fetch(`http://localhost:3010/usuarios/marcar/${libro._id || libro.id}`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ accion: actionMap[key] })
                      });
                      // Recargar listas
                      setLoading(true);
                      setError("");
                      Promise.all(
                        endpoints.map(async ({ key, path }) => {
                          const res = await fetch(`http://localhost:3010/usuarios/${path}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (!res.ok) throw new Error(`Error al obtener ${key}`);
                          const data = await res.json();
                          return { key, libros: data[key] || data[Object.keys(data)[0]] || [] };
                        })
                      )
                        .then((results) => {
                          const obj = {};
                          results.forEach(({ key, libros }) => {
                            obj[key] = libros;
                          });
                          setListas(obj);
                        })
                        .catch((err) => setError(err.message))
                        .finally(() => setLoading(false));
                    } catch (err) {
                      alert("Error al eliminar libro: " + err.message);
                    }
                  }}>Eliminar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay libros en esta lista.</p>
          )}
        </div>
      ))}
    </div>
  );
}
