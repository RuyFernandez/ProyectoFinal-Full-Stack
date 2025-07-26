import { useState } from "react";
import { FaCheck, FaArrowLeft } from "react-icons/fa6";

export function Actualizar() {
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
    // Inicializar el estado del libro con valores vacíos
    setLibro({
      id: libroSeleccionado.id, // Mantenemos solo el ID del libro
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibro((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarLibro = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);

      // Crear un objeto solo con los campos que tienen valor
      const datosActualizados = {};
      Object.entries(libro).forEach(([key, value]) => {
        if (value !== "" && !(Array.isArray(value) && value.length === 0)) {
          datosActualizados[key] = value;
        }
      });

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3010/libros/${libro.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const libroActualizado = await res.json();
      setMensaje(
        <>
          <FaCheck /> Libro actualizado con éxito
        </>
      );

      // Actualizar la lista de resultados con los datos completos del libro
      setResultados((prev) =>
        prev.map((l) => (l.id === libro.id ? { ...l, ...libroActualizado } : l))
      );

      setTimeout(() => {
        setLibro(null);
        setMensaje("");
      }, 2000);
    } catch (err) {
      console.error("Error al actualizar:", err);
      setMensaje(`Error al actualizar: ${err.message}`);
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
      <h2>Actualizar Libro</h2>

      {!libro ? (
        <div className="search-section">
          <form onSubmit={buscarLibros} className="search-form">
            <div className="form-group">
              <input
                type="text"
                id="title"
                name="title"
                className="input"
                placeholder="Buscar por título"
                value={filtro.title}
                onChange={handleFiltroChange}
              />
            </div>

            <div className="button-group">
              

            <button type="submit" className="button-search" disabled={cargando}>
              {cargando ? "Buscando..." : "Buscar"}
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

          {mensaje && (
            <div className={`message ${cargando ? "info" : ""}`}>{mensaje}</div>
          )}
          {resultados.length > 0 && (
            <div className="results-container">
              <h3>Resultados de la búsqueda</h3>
              <ul className="book-list">
                {resultados.map((lib) => (
                  <li key={lib.id} className="book-item">
                    <div className="book-info">
                      <h4>{lib.title}</h4>
                      <p>
                        <strong>Autor:</strong> {lib.author}
                      </p>
                      {lib.published_year && (
                        <p>
                          <strong>Año:</strong> {lib.published_year}
                        </p>
                      )}
                      {lib.genre && lib.genre.length > 0 && (
                        <p>
                          <strong>Géneros:</strong>{" "}
                          {Array.isArray(lib.genre)
                            ? lib.genre.join(", ")
                            : lib.genre}
                        </p>
                      )}
                    </div>
                    <button
                      className="button-edit"
                      onClick={() => seleccionarLibro(lib)}
                      disabled={cargando}
                    >
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="edit-section">
          <button
            className="button-back"
            onClick={() => setLibro(null)}
            disabled={cargando}
          >
            <FaArrowLeft /> Volver a resultados
          </button>

          <h3>Editando: {libro.title}</h3>

          <form onSubmit={actualizarLibro} className="form-update">
            <div className="form-group">
              <label>Título:</label>
              <input
                id="edit-title"
                className="input"
                type="text"
                name="title"
                value={libro.title || ""}
                onChange={handleChange}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-author">Autor:</label>
              <input
                id="edit-author"
                className="input"
                type="text"
                name="author"
                value={libro.author || ""}
                onChange={handleChange}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-genre">Géneros (separados por comas):</label>
              <input
                id="edit-genre"
                className="input"
                type="text"
                name="genre"
                value={
                  Array.isArray(libro.genre)
                    ? libro.genre.join(", ")
                    : libro.genre || ""
                }
                onChange={(e) =>
                  setLibro((prev) => ({
                    ...prev,
                    genre: e.target.value
                      .split(",")
                      .map((g) => g.trim())
                      .filter(Boolean),
                  }))
                }
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-publisher">Editorial:</label>
              <input
                id="edit-publisher"
                className="input"
                type="text"
                name="publisher"
                value={libro.publisher || ""}
                onChange={handleChange}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-year">Año de publicación:</label>
              <input
                id="edit-year"
                className="input"
                type="number"
                name="published_year"
                value={libro.published_year || ""}
                onChange={handleChange}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-pages">Número de páginas:</label>
              <input
                id="edit-pages"
                className="input"
                type="number"
                name="pages"
                value={libro.pages || ""}
                onChange={handleChange}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">Descripción:</label>
              <textarea
                id="edit-description"
                className="input textarea"
                name="description"
                value={libro.description || ""}
                onChange={handleChange}
                rows="4"
                disabled={cargando}
              />
            </div>

            {mensaje && (
              <div className={`message ${cargando ? "info" : ""}`}>
                {mensaje}
              </div>
            )}

            <div className="button-group">
              <button
                type="submit"
                className="button-update"
                disabled={cargando}
              >
                {cargando ? "Actualizando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                className="button-cancel"
                onClick={() => setLibro(null)}
                disabled={cargando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
