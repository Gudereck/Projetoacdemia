import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCarregando(false);
      return;
    }
    authApi
      .me()
      .then(setUsuario)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(email, senha) {
    const { token } = await authApi.login(email, senha);
    localStorage.setItem("token", token);
    const dadosUsuario = await authApi.me();
    setUsuario(dadosUsuario);
    return dadosUsuario;
  }

  function sair() {
    localStorage.removeItem("token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
