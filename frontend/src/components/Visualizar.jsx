import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { FaHeart, FaHeartCrack, FaClock, FaEye } from "react-icons/fa6";

export function Visualizar() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  const [filter, setFilter] = useState({
    title: "",
    author: "",
    genre: [],
    description: "",
    publisher: "",
    published_year: "",
    pages: "",
    orderBy: false,
  });

  const [usuarioEstado, setUsuarioEstado] = useState({
    likedBooks: [],
    dislikedBooks: [],
    readBooks: [],
    toReadBooks: [],
  });

  // Sincronizar estado de usuario con el backend tras recargar
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const endpoints = [
      { key: "likedBooks", url: "/usuarios/liked" },
      { key: "dislikedBooks", url: "/usuarios/disliked" },
      { key: "readBooks", url: "/usuarios/read" },
      { key: "toReadBooks", url: "/usuarios/toread" },
    ];

    Promise.all(
      endpoints.map(({ key, url }) =>
        fetch(`http://localhost:3010${url}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => {
            // El backend responde con { likedBooks: [...] } o similar
            const libros = data[key] || [];
            // Puede venir como array de objetos libro o solo ids
            return { key, books: libros.map(b => b._id || b.id || b) };
          })
          .catch(() => ({ key, books: [] }))
      )
    ).then(results => {
      const newState = {};
      results.forEach(({ key, books }) => {
        newState[key] = books;
      });
      setUsuarioEstado(newState);
    });
  }, [user]);

  const hasFilter = Object.entries(filter).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== false;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const changeButtonData = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const filterGenre = (e) => {
    e.preventDefault();
    const text = e.target.textContent.trim();

    setFilter((prev) => {
      const currentGenres = Array.isArray(prev.genre) ? [...prev.genre] : [];
      const genreIndex = currentGenres.findIndex(
        (g) =>
          g && typeof g === "string" && g.toLowerCase() === text.toLowerCase()
      );

      const updatedGenres =
        genreIndex >= 0
          ? [
              ...currentGenres.slice(0, genreIndex),
              ...currentGenres.slice(genreIndex + 1),
            ]
          : [...currentGenres, text];

      return { ...prev, genre: updatedGenres };
    });
  };

  const cleanFilters = (e) => {
    e.preventDefault();
    setFilter({
      title: "",
      author: "",
      genre: [],
      description: "",
      publisher: "",
      published_year: "",
      pages: "",
      orderBy: false,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((val) => {
              if (val) params.append(key, val);
            });
          } else if (typeof value === "boolean" && value) {
            params.append(key, "true");
          } else if (value !== "" && value !== false) {
            params.append(key, value);
          }
        });

        params.append("includeExtras", "true");

        const res = await fetch(
          `http://localhost:3010/libros?${params.toString()}`
        );
        const result = await res.json();

        setData(result.libros || []);
        setGenreOptions(result.generosDisponibles || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      }
    };

    fetchData();
  }, [filter]);

  async function marcarLibro(libroId, accion) {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3010/usuarios/marcar/${libroId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accion })
      });

 

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.error || `Error al marcar libro: ${res.status} ${res.statusText}`);
      }



      // Actualizar estado local
      setUsuarioEstado(prev => {
        const campo = {
          like: "likedBooks",
          dislike: "dislikedBooks",
          read: "readBooks",
          toRead: "toReadBooks"
        }[accion];


        let nuevos = [...prev[campo]];

        if (nuevos.includes(libroId)) {
          nuevos = nuevos.filter(id => id !== libroId);
        } else {
          nuevos.push(libroId);
        }

        return { ...prev, [campo]: nuevos };
      });

    } catch (err) {
      console.error("Error en marcarLibro:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      alert("Error al marcar libro: " + err.message);
    }
  }

  return (
    <>
    <div className="container">
      <h3>Sector para visualizar series</h3>
      <form className="filter-sector">
        <div className="first-line">
          <div className="left-filter">
            <input
              className="input"
              type="text"
              placeholder="Título"
              name="title"
              onChange={handleChange}
              value={filter.title}
            />
            <input
              className="input"
              type="text"
              placeholder="Autor"
              name="author"
              onChange={handleChange}
              value={filter.author}
            />
            <input
              className="input"
              type="number"
              placeholder="Páginas"
              name="pages"
              onChange={handleChange}
              value={filter.pages}
            />
          </div>

          <div className="right-filter">
            {hasFilter && (
              <a type="button" onClick={cleanFilters} className="btn-filter">
                Limpiar
              </a>
            )}
            
            <a
              type="button"
              onClick={() => changeButtonData("orderBy", !filter.orderBy)}
              className={`btn-filter ${filter.orderBy ? "active" : ""}`}
            >
              Ordenar
            </a>
          </div>
        </div>

        <div className="second-line">
          {genreOptions
            .slice()
            .sort((a, b) => a.localeCompare(b))
            .map((item) => (
              <a
                key={item}
                onClick={filterGenre}
                className={`genre-item ${
                  filter.genre.includes(item) ? "active" : ""
                }`}
              >
                {item}
              </a>
            ))}
        </div>
      </form>

      {data.length > 0 ? (
        data.map((item, i) => (
          <div key={i} className="libros-item">
            <h3 className="title">{item.title}</h3>
            <h5>{item.published_year}</h5>
            <h5>
              {item.publisher} - {item.author}
            </h5>
            <p className="description">{item.description}</p>
            <p className="genre">{item.genre?.join(", ")}</p>
            <span>{item.pages} Páginas</span>

            <div className="buttons-libros">

            <button
              className={usuarioEstado.likedBooks.includes(item.id) ? "icon-btn like-btn" : "icon-btn"}
              onClick={() => marcarLibro(item.id, "like")}
              disabled={!user}
              title={!user ? "Inicia sesión para marcar libros" : ""}
            >
              <FaHeart />
            </button>

            <button
              className={usuarioEstado.dislikedBooks.includes(item.id) ? "icon-btn dislike-btn" : "icon-btn"}
              onClick={() => marcarLibro(item.id, "dislike")}
              disabled={!user}
              title={!user ? "Inicia sesión para marcar libros" : ""}
            >
              <FaHeartCrack />
            </button>

            <button
              className={usuarioEstado.readBooks.includes(item.id) ? "icon-btn read-btn " : "icon-btn"}
              onClick={() => marcarLibro(item.id, "read")}
              disabled={!user}
              title={!user ? "Inicia sesión para marcar libros" : ""}
            >
              <FaEye />
            </button>

            <button
              className={usuarioEstado.toReadBooks.includes(item.id) ? "icon-btn to-read-btn " : "icon-btn"}
              onClick={() => marcarLibro(item.id, "toRead")}
              disabled={!user}
              title={!user ? "Inicia sesión para marcar libros" : ""}
            >
              <FaClock />
            </button>
            </div>
          </div>
        ))
      ) : (
        <p>No se encontraron libros con los filtros seleccionados</p>
      )}
      </div>
    </>
  );
}

