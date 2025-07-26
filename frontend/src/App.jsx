import { Routes, Route, Link } from 'react-router-dom'
import './style.css'
import { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from './components/AuthContext'

import { Home } from './components/Home'  
import { Login } from './components/Login'
import { AuthProvider } from './components/AuthContext'
import { Crear } from './components/Crear'
import { Visualizar } from './components/Visualizar'
import { Actualizar } from './components/Actualizar'
import { Reemplazar } from './components/Reemplazar'
import { Eliminar } from './components/Eliminar'
import { Register } from './components/Register'
import ListasUsuario from './components/ListasUsuario'
import { FaSignOutAlt } from "react-icons/fa";


function NavbarAndRoutes() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Cierra el menú al navegar
  function handleNavClick() {
    setMenuOpen(false);
  }

  // Cierra el menú al clickear fuera o con Escape
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  return (
    <>
        
      <nav className="navbar" ref={navRef} role="navigation" aria-label="Menú principal">
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((open) => !open)}
          ref={hamburgerRef}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
          <Link to={'/'} onClick={handleNavClick}>Home</Link>
          {user?.role === 'admin' && <Link to={'/crear'} onClick={handleNavClick}>Crear</Link>}
          <Link to={'/visualizar'} onClick={handleNavClick}>Visualizar</Link>
          {user && <Link to={'/mis-listas'} onClick={handleNavClick}>Mis listas</Link>}
          {user?.role === 'admin' && <Link to={'/actualizar'} onClick={handleNavClick}>Actualizar</Link>}
          {user?.role === 'admin' && <Link to={'/reemplazar'} onClick={handleNavClick}>Reemplazar</Link>}
          {user?.role === 'admin' && <Link to={'/eliminar'} onClick={handleNavClick}>Eliminar</Link>}
          {user?.role === 'admin' && <Link to={'/ejemplo404'} onClick={handleNavClick}>Ejemplo 404</Link>}
          <div className="login-register">
            {!user && <Link to={'/login'} onClick={handleNavClick}>Login</Link>}
            {!user && <Link to={'/register'} onClick={handleNavClick}>Register</Link>}
          </div>
        </div>
          {user && (
            <>
              <span>
                Bienvenido, <b>{user.username}</b>
              </span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="button-logout"><FaSignOutAlt /></button>
            </>
          )}
      </nav>
      <Routes>
        <Route path='/' element={<Home/>}/>
        {user?.role === 'admin' && <Route path='/crear' element={ <Crear/> }/>}
        <Route path='/visualizar' element={ <Visualizar/> }/>
        {user?.role === 'admin' && <Route path='/actualizar' element={<Actualizar/>}/>} 
        {user?.role === 'admin' && <Route path='/reemplazar' element={<Reemplazar/>}/>} 
        {user?.role === 'admin' && <Route path='/eliminar' element={<Eliminar/>}/>} 
        <Route path='/mis-listas' element={<ListasUsuario/>}/>
        {user?.role === 'admin' && <Route path='*' element={<h1>404 NOT FOUND</h1>}/>} 
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NavbarAndRoutes />
    </AuthProvider>
  );
}

export default App;
