import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__conteudo entrada-suave">
        <div className="not-found-page__icone" aria-hidden="true">
          <Compass size={28} strokeWidth={2} />
        </div>
        <p className="not-found-page__codigo">404</p>
        <h1>Página não encontrada</h1>
        <p className="not-found-page__mensagem">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <Link to="/" className="botao botao-primario">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
