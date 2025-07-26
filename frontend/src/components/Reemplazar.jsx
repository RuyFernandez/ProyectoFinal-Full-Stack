import { useState } from "react";
import { FaCheck, FaArrowLeft } from "react-icons/fa6";

export function Reemplazar() {
  const [filtro, setFiltro] = useState({
    title: "",
    author: "",
    genre: [],
    description: "",
    publisher: "",
    published_year: "",
    pages: "",
  });
  const [resultados, setResultados] = useState([]);
  const [libro, setLibro] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const buscarLibros = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("Buscando libros...");

    try {
      const params = new URLSearchParams();

      Object.entries(filtro).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((val) => params.append(key, val));
        } else if (value) {
          params.append(key, value);
        }
      });

      const res = await fetch(
        `http://localhost:3010/libros?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (!data.libros || data.libros.length === 0) {
        setMensaje("No se encontraron libros con los filtros seleccionados");
        setResultados([]);
      } else {
        setResultados(data.libros);
        setMensaje(`Se encontraron ${data.libros.length} libros`);
      }

      setLibro(null);
    } catch (err) {
      console.error("Error al buscar libros:", err);
      setMensaje(`Error al buscar: ${err.message}`);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarLibro = (libroSeleccionado) => {
  setLibro({
    ...libroSeleccionado,
    genre: Array.isArray(libroSeleccionado.genre)
      ? libroSeleccionado.genre.join(", ")
      : (libroSeleccionado.genre || "")
  });
  setResultados([]);
  setMensaje("");
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibro((prev) => ({ ...prev, [name]: value }));
  };

  const reemplazarLibro = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);

      // Crear un objeto solo con los campos que tienen valor
      const datosReemplazados = {};
      Object.entries(libro).forEach(([key, value]) => {
        if (value !== "" && !(Array.isArray(value) && value.length === 0)) {
          datosReemplazados[key] = value;
        }
      });

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3010/libros/${libro.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosReemplazados),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const libroReemplazado = await res.json();
      setMensaje(
        <>
          <FaCheck /> Libro reemplazado con éxito
        </>
      );

      // Actualizar la lista de resultados con los datos completos del libro
      setResultados((prev) =>
        prev.map((l) => (l.id === libro.id ? { ...l, ...libroReemplazado } : l))
      );

      setTimeout(() => {
        setLibro(null);
        setMensaje("");
      }, 2000);
    } catch (err) {
      console.error("Error al reemplazar:", err);
      setMensaje(`Error al reemplazar: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
    setMensaje("");
  };

  const limpiarBusqueda = () => {
    setFiltro({
      title: "",
      author: "",
      genre: [],
      description: "",
      publisher: "",
      published_year: "",
      pages: "",
    });
    setResultados([]);
    setMensaje("");
  };

  return (
    <div className="container">
      <h2>Reemplazar libro</h2>

      {!libro ? (
        <div className="search-section">
          <form onSubmit={buscarLibros} className="search-form">
            <input
              type="text"
              name="title"
              placeholder="Buscar por título"
              value={filtro.title}
              onChange={handleFiltroChange}
              className="input"
            />
            <div className="button-group">
            <button type="submit" className="button-search">
              Buscar
            </button>
            <button 
              type="button" 
              className="button-clear"
              onClick={limpiarBusqueda}
              disabled={!filtro.title && resultados.length === 0}
            >
              Limpiar
            </button>
            </div>
          </form>

          <ul className="book-list">
            {resultados.map((libro) => (
              <li key={libro.id} className="book-item">
                <div className="book-info">
                  <h4>{libro.title}</h4>
                  <p>
                    <strong>Autor:</strong> {libro.author}
                  </p>
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
                <button onClick={() => seleccionarLibro(libro)} className="button-edit">Reemplazar</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <form onSubmit={reemplazarLibro} className="form-edit">
          <h3>Reemplazar: {libro.title}</h3>

          <div className="form-group">
            <label htmlFor="replace-title">Título:</label>
            <input id="replace-title" name="title" className="input" value={libro.title || ''} onChange={handleChange} required disabled={cargando} />
          </div>

          <div className="form-group">
            <label htmlFor="replace-author">Autor:</label>
            <input id="replace-author" name="author" className="input" value={libro.author || ''} onChange={handleChange} required disabled={cargando} />
          </div>

          <div className="form-group">
            <label htmlFor="replace-genre">Géneros (coma separados):</label>
            <input id="replace-genre" name="genre" className="input" value={libro.genre || ''} onChange={handleChange} required disabled={cargando} />
          </div>

          <div className="form-group">
            <label htmlFor="replace-publisher">Editorial:</label>
            <input id="replace-publisher" name="publisher" className="input" value={libro.publisher || ''} onChange={handleChange} required disabled={cargando} />
          </div>

          <div className="form-group">
            <label htmlFor="replace-year">Año de publicación:</label>
            <input id="replace-year" name="published_year" className="input" type="number" value={libro.published_year || ''} onChange={handleChange} required disabled={cargando} />
          </div>

          <div className="form-group">
            <label htmlFor="replace-pages">Número de páginas:</label>
            <input id="replace-pages" name="pages" className="input" type="number" value={libro.pages || ''} onChange={handleChange} required disabled={cargando} />
          </div>

          <div className="form-group">
            <label htmlFor="replace-description">Descripción:</label>
            <textarea id="replace-description" name="description" className="input textarea" value={libro.description || ''} onChange={handleChange} rows="4" required disabled={cargando} />
          </div>

          {mensaje && (
            <div className={`message ${cargando ? "info" : ""}`}>{mensaje}</div>
          )}

          <div className="button-group">
            <button type="submit" className="button-update" disabled={cargando}>Reemplazar</button>
            <button type="button" onClick={() => setLibro(null)} className="button-cancel" disabled={cargando}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
