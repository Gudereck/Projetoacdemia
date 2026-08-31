import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { listarTreinosPorAluno } from "../api/treinos";
import { buscarAluno } from "../api/alunos";
import { useAuth } from "../auth/AuthContext";
import { WeekTable } from "../components/WeekTable";
import { SkeletonCartoes } from "../components/Skeleton";
import "./AlunoTreinoPage.css";

export function AlunoTreinoPage() {
  const { usuario } = useAuth();
  const params = useParams();
  const alunoId = params.alunoId ? Number(params.alunoId) : usuario.alunoId;

  const [aluno, setAluno] = useState(null);
  const [treinos, setTreinos] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setTreinos(null);
    setErro(null);

    const carregarAluno = params.alunoId ? buscarAluno(alunoId) : Promise.resolve(null);

    Promise.all([carregarAluno, listarTreinosPorAluno(alunoId)])
      .then(([dadosAluno, dadosTreinos]) => {
        setAluno(dadosAluno);
        setTreinos(dadosTreinos);
      })
      .catch((erroRequisicao) => {
        setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível carregar o treino.");
      });
  }, [alunoId, params.alunoId]);

  if (erro) {
    return <div className="mensagem-erro">{erro}</div>;
  }

  return (
    <div>
      <h1>{aluno ? `Treino de ${aluno.nome}` : "Meu treino"}</h1>
      <p className="aluno-treino__subtitulo">
        <CalendarDays size={16} strokeWidth={2} />
        Exercícios organizados por dia da semana.
      </p>

      {treinos === null ? <SkeletonCartoes quantidade={3} /> : <WeekTable treinos={treinos} />}
    </div>
  );
}
