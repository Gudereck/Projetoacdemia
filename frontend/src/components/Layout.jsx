import { Dumbbell, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Layout.css";

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

const ROTULO_PERFIL = {
  ADMIN: "Administrador",
  PROFESSOR: "Professor",
  ALUNO: "Aluno",
  ATENDENTE: "Atendente",
};

export function Layout() {
  const { usuario, sair } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <header className="layout__topo">
        <Link to="/" className="layout__marca">
          <Dumbbell size={22} strokeWidth={2.5} />
          Academia
        </Link>
        {usuario && (
          <div className="layout__usuario">
            <div className="layout__avatar" aria-hidden="true">
              {iniciais(usuario.nome)}
            </div>
            <div className="layout__info-usuario">
              <span className="layout__nome">{usuario.nome}</span>
              <span className="layout__perfil">{ROTULO_PERFIL[usuario.perfil] ?? usuario.perfil}</span>
            </div>
            <button type="button" className="botao botao-secundario" onClick={sair}>
              <LogOut size={16} strokeWidth={2.25} />
              Sair
            </button>
          </div>
        )}
      </header>
      <main className="layout__conteudo">
        <div className="entrada-suave" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
