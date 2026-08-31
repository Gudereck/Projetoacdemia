import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Dumbbell, Lock, Mail } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

export function LoginPage() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to="/" replace />;
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await entrar(email, senha);
      navigate("/", { replace: true });
    } catch (erroRequisicao) {
      const mensagem = erroRequisicao.response?.data?.mensagem ?? "Não foi possível entrar.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-page">
      <form className="cartao login-page__form entrada-suave" onSubmit={aoEnviar}>
        <div className="login-page__marca">
          <Dumbbell size={28} strokeWidth={2.25} />
        </div>
        <h1>Academia</h1>
        <p className="login-page__subtitulo">Entre com seu e-mail e senha</p>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <div className="login-page__campo-icone">
            <Mail size={16} strokeWidth={2} />
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <div className="login-page__campo-icone">
            <Lock size={16} strokeWidth={2} />
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="botao botao-primario login-page__botao" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
