import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Dumbbell, Users, LayoutList, Activity, ArrowRight, Wrench, CalendarClock, Megaphone, Percent } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { listarPlanosPublico } from "../api/planos";
import "./HomePage.css";

const ROTA_POR_PERFIL = {
  ALUNO: "/meu-treino",
  PROFESSOR: "/professor",
  ADMIN: "/admin",
  ATENDENTE: "/recepcao",
};

const RECURSOS = [
  {
    icone: Dumbbell,
    titulo: "Equipamentos modernos",
    descricao: "Estrutura completa de musculação e cardio, sempre em bom estado.",
  },
  {
    icone: Users,
    titulo: "Professores qualificados",
    descricao: "Equipe pronta pra orientar cada treino e tirar dúvidas na hora.",
  },
  {
    icone: LayoutList,
    titulo: "Planos flexíveis",
    descricao: "Escolha a duração que faz sentido pra sua rotina, sem burocracia.",
  },
  {
    icone: Activity,
    titulo: "Treino acompanhado",
    descricao: "Sua ficha de exercícios organizada por dia da semana, sempre à mão.",
  },
];

const PROFESSORES = [
  { especialidade: "Musculação", cabelo: "curto" },
  { especialidade: "Funcional", cabelo: "preso" },
  { especialidade: "Natação", cabelo: "cacheado" },
  { especialidade: "Lutas", cabelo: "raspado" },
];

const MODALIDADES = [
  "Musculação",
  "Funcional",
  "Spinning",
  "Yoga",
  "Hidroginástica",
  "Natação livre",
  "Jiu-jitsu",
  "Alongamento",
];

const NOVIDADES = [
  { Icone: Megaphone, titulo: "Nova turma de funcional aos sábados" },
  { Icone: Wrench, titulo: "Manutenção da sala de musculação" },
  { Icone: CalendarClock, titulo: "Horário especial no feriado" },
  { Icone: Percent, titulo: "Promoção de matrícula do mês" },
];

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function IlustracaoTreino() {
  return (
    <svg viewBox="0 0 200 220" fill="none">
      <circle cx="150" cy="50" r="38" fill="var(--cor-destaque)" opacity="0.16" />
      <ellipse cx="100" cy="205" rx="46" ry="8" fill="#000" opacity="0.25" />
      <rect x="40" y="46" width="120" height="10" rx="5" fill="#c9863f" />
      <circle cx="46" cy="51" r="13" fill="#8a5a28" />
      <circle cx="154" cy="51" r="13" fill="#8a5a28" />
      <path d="M74 100 60 55" stroke="#caa07c" strokeWidth="13" strokeLinecap="round" />
      <path d="M126 100 140 55" stroke="#caa07c" strokeWidth="13" strokeLinecap="round" />
      <circle cx="100" cy="48" r="17" fill="#caa07c" />
      <path d="M83 42a17 17 0 0 1 34 0c0-3-4-10-17-10s-17 7-17 10z" fill="#2b2b28" />
      <path
        d="M78 68c0-8 10-14 22-14s22 6 22 14v38c0 6-5 10-11 10H89c-6 0-11-4-11-10z"
        fill="var(--cor-destaque)"
      />
      <path d="M80 116h40l6 26H74z" fill="#2b2b28" />
      <rect x="80" y="140" width="15" height="52" rx="7" fill="#caa07c" />
      <rect x="105" y="140" width="15" height="52" rx="7" fill="#caa07c" />
      <path d="M76 188h23v8c0 4-3 6-7 6H80c-4 0-6-3-4-7z" fill="#f0ece2" />
      <path d="M101 188h23v8c0 4-3 6-7 6h-12c-4 0-6-3-4-7z" fill="#f0ece2" />
    </svg>
  );
}

function IlustracaoEquipe() {
  return (
    <svg viewBox="0 0 200 150" fill="none">
      <ellipse cx="100" cy="144" rx="70" ry="6" fill="#000" opacity="0.12" />
      <circle cx="62" cy="34" r="15" fill="#fff" opacity="0.95" />
      <path d="M48 30a15 15 0 0 1 30 0c0-3-4-9-15-9s-15 6-15 9z" fill="#fff" opacity="0.6" />
      <path d="M40 132c0-19 10-34 22-34s22 15 22 34" fill="#fff" opacity="0.95" />
      <path d="M40 132h44l-3 8H43z" fill="#fff" opacity="0.7" />
      <circle cx="142" cy="26" r="17" fill="#fff" />
      <path d="M126 22a17 17 0 0 1 34 0c-3-6-11-11-17-11s-14 5-17 11z" fill="#fff" opacity="0.6" />
      <path d="M118 132c0-24 11-42 24-42s24 18 24 42" fill="#fff" />
      <path d="M118 132h48l-3 9h-42z" fill="#fff" opacity="0.7" />
      <path d="M142 62c9 4 16 12 19 22" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function IlustracaoPrancheta() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <rect x="24" y="14" width="52" height="72" rx="8" fill="var(--cor-destaque)" opacity="0.85" />
      <rect x="38" y="8" width="24" height="12" rx="4" fill="var(--cor-texto)" />
      <rect x="34" y="36" width="32" height="6" rx="3" fill="#fff" />
      <rect x="34" y="50" width="24" height="6" rx="3" fill="#fff" opacity="0.8" />
      <rect x="34" y="64" width="28" height="6" rx="3" fill="#fff" opacity="0.6" />
    </svg>
  );
}

const CABELOS = {
  curto: (
    <path
      d="M18 40c0-14 10-22 22-22s22 8 22 22c-3-3-8-6-13-6-2 3-6 5-9 5s-7-2-9-5c-5 0-10 3-13 6z"
      fill="#2b2b28"
    />
  ),
  preso: (
    <>
      <path
        d="M18 38a22 22 0 0 1 44 0c0 6-2 10-4 13-1-8-4-12-8-12-4 4-24 4-28 0-4 0-7 4-8 12-2-3-4-7-4-13z"
        fill="#4a2f1a"
      />
      <path d="M14 46c-3 6-3 16 0 22" stroke="#4a2f1a" strokeWidth="6" strokeLinecap="round" />
      <path d="M66 46c3 6 3 16 0 22" stroke="#4a2f1a" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  cacheado: (
    <>
      <path
        d="M17 34c2-12 11-20 23-20s21 8 23 20c-4-4-9-4-11-1-3-5-9-8-12-8s-9 3-12 8c-2-3-7-3-11 1z"
        fill="#1f1f1c"
      />
      <circle cx="20" cy="30" r="5" fill="#1f1f1c" />
      <circle cx="14" cy="36" r="5" fill="#1f1f1c" />
      <circle cx="60" cy="30" r="5" fill="#1f1f1c" />
      <circle cx="66" cy="36" r="5" fill="#1f1f1c" />
    </>
  ),
  raspado: (
    <path d="M18 40a22 22 0 0 1 44 0" stroke="#2b2b28" strokeWidth="4" fill="none" strokeLinecap="round" />
  ),
};

function AvatarProfessor({ cabelo }) {
  return (
    <svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="46" r="22" fill="#caa07c" />
      {CABELOS[cabelo]}
      <circle cx="33" cy="48" r="2.4" fill="#2b2b28" />
      <circle cx="47" cy="48" r="2.4" fill="#2b2b28" />
      <path d="M33 57c3 3 11 3 14 0" stroke="#2b2b28" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Ref-callback em vez de useEffect+useRef: a HomePage só renderiza esta div
// depois que a autenticação termina de carregar (return antecipado acima disso),
// então um useEffect de dependência fixa rodaria cedo demais, com a ref ainda
// vazia, e nunca de novo. O callback abaixo dispara exatamente quando o nó
// real entra ou sai do DOM.
function useRevelarAoRolar() {
  const observadorRef = useRef(null);

  return useCallback((no) => {
    observadorRef.current?.disconnect();
    observadorRef.current = null;
    if (!no) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("em-vista");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    no.querySelectorAll(".revelar").forEach((el) => observador.observe(el));
    observadorRef.current = observador;
  }, []);
}

function SecaoPlanos() {
  const [planos, setPlanos] = useState(null);

  useEffect(() => {
    listarPlanosPublico()
      .then(setPlanos)
      .catch(() => setPlanos([]));
  }, []);

  return (
    <div className="planos-linha">
      <div className="foto foto--mini">
        <IlustracaoPrancheta />
      </div>
      <div>
        {planos === null && <p>Carregando planos…</p>}
        {planos?.length === 0 && <p>Nenhum plano disponível no momento.</p>}
        {planos?.map((plano) => (
          <div key={plano.id}>
            <h4>
              {plano.nome} — R$ {formatarPreco(plano.valor)}/mês
            </h4>
            <p>
              {plano.duracaoMeses === 1 ? "Sem fidelidade" : `Fidelidade de ${plano.duracaoMeses} meses`}, acesso
              completo.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const { usuario, carregando } = useAuth();
  const raiz = useRevelarAoRolar();

  if (carregando) {
    return <div className="tela-carregando">Carregando…</div>;
  }

  if (usuario) {
    return <Navigate to={ROTA_POR_PERFIL[usuario.perfil] ?? "/login"} replace />;
  }

  return (
    <div className="home-page" ref={raiz}>
      <div className="barra-topo">
        <span>[email de contato]</span>
        <span>Tel.: [telefone]</span>
      </div>

      <header className="topo">
        <span className="marca">
          <Dumbbell size={22} strokeWidth={2.5} />
          Academia
        </span>
        <nav className="nav">
          <a href="#quem-somos">Quem somos</a>
          <a href="#planos">Planos</a>
          <a href="#novidades">Novidades</a>
          <a href="#professores">Professores</a>
          <a href="#modalidades">Modalidades</a>
        </nav>
        <Link to="/login" className="botao botao-primario">
          Entrar
        </Link>
      </header>

      <main>
        <section className="hero">
          <div className="foto foto--escura">
            <IlustracaoTreino />
          </div>
          <div className="hero-conteudo">
            <span className="hero-rotulo">MUSCULAÇÃO E FUNCIONAL</span>
            <h1>
              Sua evolução
              <br />
              começa aqui
            </h1>
            <p className="sub">
              Estrutura completa, professores de confiança e um treino pensado pra você, organizado dia a dia.
            </p>
            <div className="hero-acoes">
              <Link to="/login" className="botao botao-primario botao-pulso">
                Entrar na plataforma
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a href="#planos" className="botao botao-contorno-claro">
                Ver planos
              </a>
            </div>
          </div>
          <div className="hero-pontos">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <section className="faixa-destaque" id="quem-somos">
          <div className="revelar">
            <span className="rotulo">ACADEMIA · INSTITUCIONAL</span>
            <h2>Quem somos</h2>
            <p>
              [Nº] anos de mercado oferecendo a maior variedade de modalidades, com professores capacitados e
              ambiente seguro para todas as idades.
            </p>
          </div>
          <div className="revelar">
            <span className="rotulo">ACADEMIA · ESTRUTURA</span>
            <h2>Infraestrutura</h2>
            <p>
              Espaço amplo com sala de musculação, área de cardio, sala de funcional e vestiários completos para
              todos os alunos.
            </p>
          </div>
          <div className="foto revelar">
            <IlustracaoEquipe />
          </div>
        </section>

        <section className="secao-clara" id="planos">
          <div className="grade-planos-horarios">
            <div className="bloco-texto revelar">
              <span className="rotulo">Promoções</span>
              <h2>Planos</h2>
              <SecaoPlanos />
              <Link to="/login" className="botao botao-primario">
                Ver todos os planos
              </Link>
            </div>
            <div className="bloco-texto revelar">
              <span className="rotulo">Todos os dias</span>
              <h2>Horários</h2>
              <p>[Seg a Sex: horário] · [Sáb: horário]. Confira o funcionamento de cada modalidade com a recepção.</p>
              <div className="grade-horario-icones">
                <div className="cartao-icone-mini">
                  <div className="icone">
                    <Dumbbell size={20} strokeWidth={2} />
                  </div>
                  <h5>MUSCULAÇÃO</h5>
                  <p>Treino livre com acompanhamento.</p>
                </div>
                <div className="cartao-icone-mini">
                  <div className="icone">
                    <Activity size={20} strokeWidth={2} />
                  </div>
                  <h5>FUNCIONAL</h5>
                  <p>Aulas em grupo de alta intensidade.</p>
                </div>
                <div className="cartao-icone-mini">
                  <div className="icone">
                    <Users size={20} strokeWidth={2} />
                  </div>
                  <h5>AQUÁTICA</h5>
                  <p>Hidroginástica e natação livre.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="secao-recursos">
          {RECURSOS.map(({ icone: Icone, titulo, descricao }) => (
            <div key={titulo} className="cartao-recurso revelar">
              <div className="cartao-recurso-icone">
                <Icone size={22} strokeWidth={2} />
              </div>
              <h3>{titulo}</h3>
              <p>{descricao}</p>
            </div>
          ))}
        </section>

        <section className="faixa-newsletter revelar">
          <div>
            <h3>Newsletter</h3>
            <p>Cadastre seu e-mail e receba as novidades da academia.</p>
          </div>
          <form className="form-newsletter" onSubmit={(evento) => evento.preventDefault()}>
            <input type="text" placeholder="Nome" />
            <input type="email" placeholder="E-mail" />
            <button type="submit" className="botao botao-primario">
              Enviar
            </button>
          </form>
        </section>

        <section className="secao-clara" id="novidades">
          <div className="bloco-texto revelar secao-titulo-central">
            <span className="rotulo">Fique por dentro</span>
            <h2>Novidades</h2>
          </div>
          <div className="grade-novidades">
            {NOVIDADES.map(({ Icone, titulo }) => (
              <div key={titulo} className="card-novidade revelar">
                <div className="foto foto--mini">
                  <Icone size={34} strokeWidth={1.5} color="var(--cor-destaque)" />
                </div>
                <span className="data">[Data]</span>
                <h5>{titulo}</h5>
              </div>
            ))}
          </div>
        </section>

        <section className="faixa-equipe">
          <div className="revelar" id="professores">
            <span className="rotulo">Nosso time</span>
            <h2>Professores</h2>
            <div className="grade-professores">
              {PROFESSORES.map(({ especialidade, cabelo }) => (
                <div key={especialidade} className="professor">
                  <div className="avatar">
                    <AvatarProfessor cabelo={cabelo} />
                  </div>
                  <h5>[Nome]</h5>
                  <p>{especialidade}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="revelar" id="modalidades">
            <span className="rotulo">Explore</span>
            <h2>Modalidades</h2>
            <ul className="lista-modalidades">
              {MODALIDADES.map((modalidade) => (
                <li key={modalidade}>{modalidade}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="rodape-grade">
          <div>
            <h4>Links rápidos</h4>
            <ul>
              <li>
                <a href="#quem-somos">Quem somos</a>
              </li>
              <li>
                <a href="#planos">Planos</a>
              </li>
              <li>
                <a href="#novidades">Novidades</a>
              </li>
              <li>
                <a href="#professores">Professores</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Localização</h4>
            <p>
              [Endereço da unidade]
              <br />
              [Bairro, Cidade]
            </p>
            <p>Tel.: [telefone]</p>
            <div className="redes">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <h4>Institucional</h4>
            <p>Academia dedicada a oferecer estrutura completa e acompanhamento profissional para todos os níveis.</p>
          </div>
          <div>
            <h4>Fale conosco</h4>
            <form className="form-contato" onSubmit={(evento) => evento.preventDefault()}>
              <input type="text" placeholder="Nome" />
              <input type="email" placeholder="E-mail" />
              <textarea rows={2} placeholder="Mensagem" />
              <button type="submit" className="botao botao-primario" style={{ justifyContent: "center" }}>
                Enviar
              </button>
            </form>
          </div>
        </div>
        <p className="rodape-base">© Academia — todos os direitos reservados</p>
      </footer>
    </div>
  );
}
