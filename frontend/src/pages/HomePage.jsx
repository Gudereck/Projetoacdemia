import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Dumbbell,
  Users,
  LayoutList,
  Activity,
  ArrowRight,
  Wrench,
  CalendarClock,
  Megaphone,
  Percent,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { listarPlanosPublico } from "../api/planos";
import fotoHero from "../assets/fotos/hero-treino.webp";
import fotoEstrutura from "../assets/fotos/estrutura-academia.webp";
import fotoProfessor1 from "../assets/fotos/professor-1.webp";
import fotoProfessor2 from "../assets/fotos/professor-2.webp";
import fotoProfessor3 from "../assets/fotos/professor-3.webp";
import fotoProfessor4 from "../assets/fotos/professor-4.webp";
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
  { especialidade: "Musculação", foto: fotoProfessor1 },
  { especialidade: "Funcional", foto: fotoProfessor2 },
  { especialidade: "Natação", foto: fotoProfessor3 },
  { especialidade: "Lutas", foto: fotoProfessor4 },
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
        <ClipboardList size={40} strokeWidth={2} color="#fff" />
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
          <img src={fotoHero} alt="Aluno treinando com halteres na academia" className="hero-foto" />
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
          <div className="foto-frame revelar">
            <img src={fotoEstrutura} alt="Equipamentos e estrutura da academia" />
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
                  <Icone size={34} strokeWidth={2} color="#fff" />
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
              {PROFESSORES.map(({ especialidade, foto }) => (
                <div key={especialidade} className="professor">
                  <div className="avatar">
                    <img src={foto} alt={`Professor de ${especialidade}`} />
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
