import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export function Login() {

  const { login } = useContext(AuthContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(usernameOrEmail, password);
    setLoading(false);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Usuario o Email"
          value={usernameOrEmail}
          onChange={e => setUsernameOrEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="button-login" type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Entrar"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}