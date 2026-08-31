import { useEffect, useState } from "react";
import { Plus, UserRound } from "lucide-react";
import { listarAlunos } from "../api/alunos";
import { listarPlanos } from "../api/planos";
import { FormularioAluno } from "../components/FormularioAluno";
import { PainelAcoesAluno } from "../components/PainelAcoesAluno";
import { SkeletonTabela } from "../components/Skeleton";
import "./RecepcaoPage.css";

export function RecepcaoPage() {
  const [alunos, setAlunos] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [erro, setErro] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  useEffect(() => {
    Promise.all([listarAlunos(), listarPlanos()])
      .then(([listaAlunos, listaPlanos]) => {
        setAlunos(listaAlunos);
        setPlanos(listaPlanos);
      })
      .catch((erroRequisicao) => {
        setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível carregar os dados.");
      });
  }, []);

  function aoCadastrarAluno(alunoCriado) {
    setAlunos((atual) => [...atual, alunoCriado]);
    setMostrarFormulario(false);
    setAlunoSelecionado(alunoCriado);
  }

  if (erro) {
    return <div className="mensagem-erro">{erro}</div>;
  }

  return (
    <div>
      <h1>Recepção</h1>
      <p className="recepcao-page__subtitulo">Cadastre alunos, crie o login, matricule em um plano e registre pagamentos.</p>

      {mostrarFormulario ? (
        <FormularioAluno onCriado={aoCadastrarAluno} onCancelar={() => setMostrarFormulario(false)} />
      ) : (
        <button
          type="button"
          className="botao botao-primario"
          style={{ marginBottom: "var(--sp-4)" }}
          onClick={() => setMostrarFormulario(true)}
        >
          <Plus size={16} strokeWidth={2.5} />
          Novo aluno
        </button>
      )}

      {alunos === null ? (
        <div className="cartao" style={{ padding: 0 }}>
          <SkeletonTabela linhas={4} colunas={3} />
        </div>
      ) : alunos.length === 0 ? (
        <div className="tela-vazia">Nenhum aluno cadastrado ainda.</div>
      ) : (
        <div className="cartao" style={{ padding: 0 }}>
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td data-rotulo="Nome">{aluno.nome}</td>
                  <td data-rotulo="CPF">{aluno.cpf}</td>
                  <td data-rotulo="Telefone">{aluno.telefone ?? "—"}</td>
                  <td data-rotulo="">
                    <button
                      type="button"
                      className="botao botao-secundario"
                      onClick={() => setAlunoSelecionado(aluno)}
                    >
                      <UserRound size={14} strokeWidth={2} />
                      Atender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {alunoSelecionado && (
        <PainelAcoesAluno
          aluno={alunoSelecionado}
          planos={planos}
          onFechar={() => setAlunoSelecionado(null)}
        />
      )}
    </div>
  );
}
