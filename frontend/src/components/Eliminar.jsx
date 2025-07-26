import { useState } from "react";
import { FaCheck, FaX } from "react-icons/fa6";

export function Eliminar() {
  const [filtro, setFiltro] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);
  const [cargando, setCargando] = useState(false);

  const buscarLibros = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(<><FaCheck /> Buscando libros...</>);

    try {
      const res = await fetch(`http://localhost:3010/libros?title=${filtro}`);
      const data = await res.json();

      if (!data.libros || data.libros.length === 0) {
        setMensaje(<><FaX /> No se encontraron libros</>);
        setResultados([]);
        setTimeout(() => {
          setMensaje("");
          setConfirmarId(null);
        }, 2500);
      } else {
        setResultados(data.libros);
        setMensaje(<><FaCheck /> Se encontraron {data.libros.length} libros</>);
      }
    } catch (err) {
      setMensaje(<><FaX /> Error al buscar libros: {err.message}</>);
    } finally {
      setCargando(false);
    }
  };

  const eliminarLibro = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setCargando(true);
      const res = await fetch(`http://localhost:3010/libros/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setResultados((prev) => prev.filter((lib) => lib.id !== id));
      setMensaje(<><FaCheck /> Libro eliminado con éxito </>);
      setTimeout(() => {
        setMensaje("");
        setConfirmarId(null);
      }, 2500);
    } catch (err) {
      setMensaje(<><FaX /> Error al eliminar libro: {err.message}</>);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h2>Eliminar libro</h2>

      <form onSubmit={buscarLibros} className="search-form">
        <input
          className="input"
          type="text"
          placeholder="Buscar por título"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          disabled={cargando}
          required
        />
        <button type="submit" className="button-search" disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <ul className="book-list">
        {resultados.map((libro) => (
          <li key={libro.id} className="book-item">
            <div className="book-info">
              <strong>{libro.title}</strong> - {libro.author}
              {libro.published_year && (
                <p>
                  <strong>Año:</strong> {libro.published_year}
                </p>
              )}
              {libro.genre && libro.genre.length > 0 && (
                <p>
                  <strong>Géneros:</strong>{" "}
                  {Array.isArray(libro.genre)
                    ? libro.genre.join(", ")
                    : libro.genre}
                </p>
              )}
            </div>

            {confirmarId === libro.id ? (
              <div className="confirm-delete">
                <span>¿Eliminar este libro?</span>
                <button
                  className="button-confirm"
                  onClick={() => eliminarLibro(libro.id)}
                  disabled={cargando}
                >
                  Sí
                </button>
                <button
                  className="button-cancel"
                  onClick={() => setConfirmarId(null)}
                  disabled={cargando}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                className="button-delete"
                onClick={() => setConfirmarId(libro.id)}
                disabled={cargando}
              >
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
