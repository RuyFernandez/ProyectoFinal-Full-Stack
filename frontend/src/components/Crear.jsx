import { useState } from "react";
import { FaCheck, FaX } from "react-icons/fa6";

export function Crear() {
  const [data, setData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publisher: "",
    published_year: "",
    pages: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const SearchData = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const preparedData = {
        ...data,
        genre: data.genre
          .split(",")
          .map(g => g.trim())
          .filter(Boolean),
        pages: Number(data.pages),
        published_year: Number(data.published_year),
      };

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3010/libros", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preparedData),
      });

      if (response.status === 409) {
        const result = await response.json();
        setMensaje(<><FaX /> ${result.error}</>);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      setMensaje(<><FaCheck /> Libro creado con éxito</>);

      // Reiniciar formulario tras éxito
      setData({
        title: "",
        author: "",
        genre: "",
        description: "",
        publisher: "",
        published_year: "",
        pages: ""
      });

    } catch (err) {
      console.error("Error al crear libro:", err);
      setMensaje(<><FaX /> Error: ${err.message}</>);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h3>Sector para crear series</h3>

      

      <form onSubmit={SearchData} className="form-create">
        <input 
          className="input" 
          type="text" 
          name="title" 
          placeholder="Título"
          onChange={handleChange}
          value={data.title}
          required
        />

        <input 
          className="input" 
          type="text" 
          name="author" 
          placeholder="Autor"
          onChange={handleChange}
          value={data.author}
          required
        />

        <input 
          className="input" 
          type="text" 
          name="genre" 
          placeholder="Géneros (separados por coma)"
          onChange={handleChange}
          value={data.genre}
          required
        />

        <textarea 
          className="input" 
          rows="6"
          name="description" 
          placeholder="Descripción"
          onChange={handleChange}
          value={data.description}
          required
        />

        <input 
          className="input" 
          type="text" 
          name="publisher" 
          placeholder="Editorial"
          onChange={handleChange}
          value={data.publisher}
          required
        />

        <input 
          className="input" 
          type="number" 
          name="published_year" 
          placeholder="Año de publicación"
          onChange={handleChange}
          value={data.published_year}
          required
        />

        <input 
          className="input" 
          type="number" 
          name="pages" 
          placeholder="Páginas"
          onChange={handleChange}
          value={data.pages}
          required
        />

        <input
          type="submit"
          name="search-data"
          className="button-search"
          value={cargando ? "Creando..." : "Crear"}
          disabled={cargando}
        />
      </form>

      {mensaje && (
        <div className="mensaje-info">
          {mensaje}
        </div>
      )}
    </div>
  );
}