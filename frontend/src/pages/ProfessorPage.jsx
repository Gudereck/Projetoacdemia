import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { listarAlunos } from "../api/alunos";
import { SkeletonTabela } from "../components/Skeleton";

export function ProfessorPage() {
  const [alunos, setAlunos] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarAlunos()
      .then(setAlunos)
      .catch((erroRequisicao) => {
        setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível carregar os alunos.");
      });
  }, []);

  if (erro) {
    return <div className="mensagem-erro">{erro}</div>;
  }

  return (
    <div>
      <h1>Alunos</h1>
      <p style={{ color: "var(--cor-texto-suave)", marginBottom: "var(--sp-5)" }}>
        Selecione um aluno para ver os exercícios.
      </p>

      {alunos === null ? (
        <div className="cartao" style={{ padding: 0 }}>
          <SkeletonTabela linhas={5} colunas={3} />
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
                  <td data-rotulo="Nome">
                    <Link to={`/professor/alunos/${aluno.id}`}>{aluno.nome}</Link>
                  </td>
                  <td data-rotulo="CPF">{aluno.cpf}</td>
                  <td data-rotulo="Telefone">{aluno.telefone ?? "—"}</td>
                  <td data-rotulo="">
                    <Link to={`/professor/alunos/${aluno.id}`} aria-label={`Ver treino de ${aluno.nome}`}>
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
