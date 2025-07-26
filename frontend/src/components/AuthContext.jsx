import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Cargar usuario al iniciar si hay token
  useEffect(() => {
    if (token) {
      fetch("http://localhost:3010/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    const res = await fetch("http://localhost:3010/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (username, email, password) => {
    const res = await fetch("http://localhost:3010/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};