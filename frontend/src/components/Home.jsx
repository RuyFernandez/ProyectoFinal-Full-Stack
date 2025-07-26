import React from "react";

export function Home() {
  return (
    <section className="home">
      <h1 className="home-title">Bienvenido a MiEstantería</h1>
      <p className="home-text">
        <strong>MiEstantería</strong> es tu espacio personal para organizar,
        descubrir y compartir tus lecturas. Aquí puedes:
      </p>
      <ul className="home-list">
        <li>
          📚 <strong>Explorar libros</strong> por género, autor o popularidad.
        </li>
        <li>
          ✅ <strong>Marcar si ya los leíste</strong>, si te gustaron o no, o si
          los quieres guardar para más tarde.
        </li>
        <li>
          📝 <strong>Escribir reseñas</strong> y ver lo que otros lectores
          opinan.
        </li>
        <li>
          📌 <strong>Crear listas personalizadas</strong>, como “Mis favoritos”,
          “Para leer este año” o “Relecturas”.
        </li>
        <li>
          🔍 <strong>Recibir recomendaciones</strong> según tus gustos y hábitos
          de lectura.
        </li>
      </ul>
      <p className="home-text">
        Ya sea que seas un lector empedernido o estés empezando tu camino en el
        mundo de los libros, esta plataforma te ayuda a llevar un registro de
        tus lecturas y descubrir nuevas historias que te encantarán.
      </p>
    </section>
  );
}
