import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, GraduationCap, LayoutList, Plus, Trash2, Users } from "lucide-react";
import { listarAlunos } from "../api/alunos";
import { listarProfessores } from "../api/professores";
import { listarPlanos, inativarPlano } from "../api/planos";
import { listarEquipamentos } from "../api/equipamentos";
import { listarUsuarios, inativarUsuario } from "../api/usuarios";
import { StatCard } from "../components/StatCard";
import { SkeletonCartoes, SkeletonTabela } from "../components/Skeleton";
import { FormularioUsuario } from "../components/FormularioUsuario";
import { FormularioProfessor } from "../components/FormularioProfessor";
import { FormularioPlano } from "../components/FormularioPlano";
import { FormularioEquipamento } from "../components/FormularioEquipamento";
import "./AdminPage.css";

const ABAS = [
  { chave: "alunos", rotulo: "Alunos" },
  { chave: "professores", rotulo: "Professores" },
  { chave: "planos", rotulo: "Planos" },
  { chave: "equipamentos", rotulo: "Equipamentos" },
  { chave: "usuarios", rotulo: "Usuários" },
];

const ROTULO_STATUS_EQUIPAMENTO = {
  DISPONIVEL: { texto: "Disponível", classe: "selo-sucesso" },
  MANUTENCAO: { texto: "Manutenção", classe: "selo-neutro" },
  INATIVO: { texto: "Inativo", classe: "selo-neutro" },
};

const ROTULO_PERFIL = {
  ADMIN: "Administrador",
  PROFESSOR: "Professor",
  ALUNO: "Aluno",
  ATENDENTE: "Atendente",
};

function TabelaAlunos({ alunos }) {
  if (alunos.length === 0) return <div className="tela-vazia">Nenhum aluno cadastrado.</div>;
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data de nascimento</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {alunos.map((a) => (
          <tr key={a.id}>
            <td data-rotulo="Nome">{a.nome}</td>
            <td data-rotulo="CPF">{a.cpf}</td>
            <td data-rotulo="Nascimento">{a.dataNascimento}</td>
            <td data-rotulo="">
              <Link to={`/admin/alunos/${a.id}`}>Ver treino</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TabelaProfessores({ professores }) {
  if (professores.length === 0) return <div className="tela-vazia">Nenhum professor cadastrado.</div>;
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>CREF</th>
          <th>Especialidade</th>
        </tr>
      </thead>
      <tbody>
        {professores.map((p) => (
          <tr key={p.id}>
            <td data-rotulo="Nome">{p.nome}</td>
            <td data-rotulo="CPF">{p.cpf}</td>
            <td data-rotulo="CREF">{p.cref}</td>
            <td data-rotulo="Especialidade">{p.especialidade ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TabelaPlanos({ planos, onRemover }) {
  if (planos.length === 0) return <div className="tela-vazia">Nenhum plano cadastrado.</div>;
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Duração</th>
          <th>Valor</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {planos.map((p) => (
          <tr key={p.id}>
            <td data-rotulo="Nome">{p.nome}</td>
            <td data-rotulo="Duração">
              {p.duracaoMeses} {p.duracaoMeses === 1 ? "mês" : "meses"}
            </td>
            <td className="numero" data-rotulo="Valor">R$ {Number(p.valor).toFixed(2)}</td>
            <td data-rotulo="">
              <button
                type="button"
                className="botao-remover"
                onClick={() => onRemover(p)}
                aria-label={`Remover plano ${p.nome}`}
              >
                <Trash2 size={16} strokeWidth={2} />
                Remover
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TabelaEquipamentos({ equipamentos }) {
  if (equipamentos.length === 0) return <div className="tela-vazia">Nenhum equipamento cadastrado.</div>;
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Categoria</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {equipamentos.map((e) => {
          const status = ROTULO_STATUS_EQUIPAMENTO[e.status] ?? { texto: e.status, classe: "selo-neutro" };
          return (
            <tr key={e.id}>
              <td data-rotulo="Nome">{e.nome}</td>
              <td data-rotulo="Categoria">{e.categoria}</td>
              <td data-rotulo="Status">
                <span className={`selo ${status.classe}`}>{status.texto}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TabelaUsuarios({ usuarios, alunos, professores, onRemover }) {
  function nomeVinculo(usuario) {
    if (usuario.perfil === "ALUNO") {
      return alunos.find((a) => a.id === usuario.alunoId)?.nome ?? "—";
    }
    if (usuario.perfil === "PROFESSOR") {
      return professores.find((p) => p.id === usuario.professorId)?.nome ?? "—";
    }
    return "—";
  }

  if (usuarios.length === 0) return <div className="tela-vazia">Nenhum usuário cadastrado ainda.</div>;

  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Perfil</th>
          <th>Vinculado a</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td data-rotulo="Nome">{u.nome}</td>
            <td data-rotulo="E-mail">{u.email}</td>
            <td data-rotulo="Perfil">
              <span className="selo selo-neutro">{ROTULO_PERFIL[u.perfil] ?? u.perfil}</span>
            </td>
            <td data-rotulo="Vinculado a">{nomeVinculo(u)}</td>
            <td data-rotulo="">
              <button
                type="button"
                className="botao-remover"
                onClick={() => onRemover(u)}
                aria-label={`Inativar usuário ${u.nome}`}
              >
                <Trash2 size={16} strokeWidth={2} />
                Inativar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AdminPage() {
  const [abaAtiva, setAbaAtiva] = useState("alunos");
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false);
  const [mostrarFormularioProfessor, setMostrarFormularioProfessor] = useState(false);
  const [mostrarFormularioPlano, setMostrarFormularioPlano] = useState(false);
  const [mostrarFormularioEquipamento, setMostrarFormularioEquipamento] = useState(false);

  function carregarTudo() {
    return Promise.all([
      listarAlunos(),
      listarProfessores(),
      listarPlanos(),
      listarEquipamentos(),
      listarUsuarios(),
    ]).then(([alunos, professores, planos, equipamentos, usuarios]) => {
      setDados({ alunos, professores, planos, equipamentos, usuarios });
    });
  }

  useEffect(() => {
    carregarTudo().catch((erroRequisicao) => {
      setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível carregar os dados.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function removerPlano(plano) {
    if (!window.confirm(`Remover o plano "${plano.nome}"?`)) return;
    try {
      await inativarPlano(plano.id);
      setDados((atual) => ({ ...atual, planos: atual.planos.filter((p) => p.id !== plano.id) }));
    } catch (erroRequisicao) {
      window.alert(erroRequisicao.response?.data?.mensagem ?? "Não foi possível remover o plano.");
    }
  }

  async function removerUsuario(usuario) {
    if (!window.confirm(`Inativar o login de "${usuario.nome}"?`)) return;
    try {
      await inativarUsuario(usuario.id);
      setDados((atual) => ({ ...atual, usuarios: atual.usuarios.filter((u) => u.id !== usuario.id) }));
    } catch (erroRequisicao) {
      window.alert(erroRequisicao.response?.data?.mensagem ?? "Não foi possível inativar o usuário.");
    }
  }

  function aoCriarUsuario(usuarioCriado) {
    setDados((atual) => ({ ...atual, usuarios: [...atual.usuarios, usuarioCriado] }));
    setMostrarFormularioUsuario(false);
  }

  function aoCriarProfessor(professorCriado) {
    setDados((atual) => ({ ...atual, professores: [...atual.professores, professorCriado] }));
    setMostrarFormularioProfessor(false);
  }

  function aoCriarPlano(planoCriado) {
    setDados((atual) => ({ ...atual, planos: [...atual.planos, planoCriado] }));
    setMostrarFormularioPlano(false);
  }

  function aoCriarEquipamento(equipamentoCriado) {
    setDados((atual) => ({ ...atual, equipamentos: [...atual.equipamentos, equipamentoCriado] }));
    setMostrarFormularioEquipamento(false);
  }

  if (erro) {
    return <div className="mensagem-erro">{erro}</div>;
  }

  const carregando = dados === null;
  const equipamentosDisponiveis = carregando
    ? 0
    : dados.equipamentos.filter((e) => e.status === "DISPONIVEL").length;

  return (
    <div>
      <h1>Administração</h1>

      {carregando ? (
        <SkeletonCartoes quantidade={4} />
      ) : (
        <div className="admin-page__stats">
          <StatCard icone={Users} valor={dados.alunos.length} rotulo="Alunos ativos" cor="destaque" />
          <StatCard icone={GraduationCap} valor={dados.professores.length} rotulo="Professores ativos" cor="info" />
          <StatCard icone={LayoutList} valor={dados.planos.length} rotulo="Planos ativos" cor="sucesso" />
          <StatCard icone={Dumbbell} valor={equipamentosDisponiveis} rotulo="Equipamentos disponíveis" cor="neutro" />
        </div>
      )}

      <div className="admin-page__abas" role="tablist">
        {ABAS.map((aba) => (
          <button
            key={aba.chave}
            type="button"
            role="tab"
            aria-selected={abaAtiva === aba.chave}
            className={`admin-page__aba${abaAtiva === aba.chave ? " admin-page__aba--ativa" : ""}`}
            onClick={() => setAbaAtiva(aba.chave)}
          >
            {aba.rotulo}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="cartao" style={{ padding: 0 }}>
          <SkeletonTabela linhas={5} colunas={4} />
        </div>
      ) : (
        <>
          {abaAtiva === "alunos" && (
            <div className="cartao" style={{ padding: 0 }}>
              <TabelaAlunos alunos={dados.alunos} />
            </div>
          )}
          {abaAtiva === "professores" && (
            <div>
              {mostrarFormularioProfessor ? (
                <FormularioProfessor onCriado={aoCriarProfessor} onCancelar={() => setMostrarFormularioProfessor(false)} />
              ) : (
                <button
                  type="button"
                  className="botao botao-primario"
                  style={{ marginBottom: "var(--sp-4)" }}
                  onClick={() => setMostrarFormularioProfessor(true)}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Novo professor
                </button>
              )}
              <div className="cartao" style={{ padding: 0 }}>
                <TabelaProfessores professores={dados.professores} />
              </div>
            </div>
          )}
          {abaAtiva === "planos" && (
            <div>
              {mostrarFormularioPlano ? (
                <FormularioPlano onCriado={aoCriarPlano} onCancelar={() => setMostrarFormularioPlano(false)} />
              ) : (
                <button
                  type="button"
                  className="botao botao-primario"
                  style={{ marginBottom: "var(--sp-4)" }}
                  onClick={() => setMostrarFormularioPlano(true)}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Novo plano
                </button>
              )}
              <div className="cartao" style={{ padding: 0 }}>
                <TabelaPlanos planos={dados.planos} onRemover={removerPlano} />
              </div>
            </div>
          )}
          {abaAtiva === "equipamentos" && (
            <div>
              {mostrarFormularioEquipamento ? (
                <FormularioEquipamento
                  onCriado={aoCriarEquipamento}
                  onCancelar={() => setMostrarFormularioEquipamento(false)}
                />
              ) : (
                <button
                  type="button"
                  className="botao botao-primario"
                  style={{ marginBottom: "var(--sp-4)" }}
                  onClick={() => setMostrarFormularioEquipamento(true)}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Novo equipamento
                </button>
              )}
              <div className="cartao" style={{ padding: 0 }}>
                <TabelaEquipamentos equipamentos={dados.equipamentos} />
              </div>
            </div>
          )}
          {abaAtiva === "usuarios" && (
            <div>
              {mostrarFormularioUsuario ? (
                <FormularioUsuario
                  alunos={dados.alunos}
                  professores={dados.professores}
                  onCriado={aoCriarUsuario}
                  onCancelar={() => setMostrarFormularioUsuario(false)}
                />
              ) : (
                <button
                  type="button"
                  className="botao botao-primario"
                  style={{ marginBottom: "var(--sp-4)" }}
                  onClick={() => setMostrarFormularioUsuario(true)}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Novo usuário
                </button>
              )}
              <div className="cartao" style={{ padding: 0 }}>
                <TabelaUsuarios
                  usuarios={dados.usuarios}
                  alunos={dados.alunos}
                  professores={dados.professores}
                  onRemover={removerUsuario}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
