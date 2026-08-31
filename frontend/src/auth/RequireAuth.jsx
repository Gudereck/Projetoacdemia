import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAuth({ perfis, children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div className="tela-carregando">Carregando…</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (perfis && !perfis.includes(usuario.perfil)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
