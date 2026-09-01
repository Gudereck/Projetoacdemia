import { Dumbbell, Flame, Moon } from "lucide-react";
import { ORDEM_DIAS, LABEL_DIA, diaSemanaAtual } from "./diasSemana";
import "./WeekTable.css";

function ExerciciosDoTreino({ treino }) {
  if (treino.exercicios.length === 0) {
    return <p className="week-table__sem-exercicio">Nenhum exercício cadastrado ainda.</p>;
  }

  return (
    <table className="tabela week-table__tabela">
      <thead>
        <tr>
          <th>Exercício</th>
          <th>Séries</th>
          <th>Reps</th>
          <th>Carga</th>
          <th>Descanso</th>
          <th>Equipamento</th>
        </tr>
      </thead>
      <tbody>
        {treino.exercicios.map((ex) => (
          <tr key={ex.id}>
            <td data-rotulo="Exercício">{ex.nomeExercicio}</td>
            <td className="numero" data-rotulo="Séries">{ex.series}</td>
            <td className="numero" data-rotulo="Reps">{ex.repeticoes}</td>
            <td className="numero" data-rotulo="Carga">{ex.cargaKg != null ? `${ex.cargaKg} kg` : "—"}</td>
            <td data-rotulo="Descanso">{ex.descansoSegundos != null ? `${ex.descansoSegundos}s` : "—"}</td>
            <td data-rotulo="Equipamento">{ex.equipamentoNome ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function WeekTable({ treinos }) {
  const hoje = diaSemanaAtual();
  const treinosPorDia = ORDEM_DIAS.reduce((acc, dia) => {
    acc[dia] = treinos.filter((t) => t.diaSemana === dia);
    return acc;
  }, {});

  return (
    <div className="week-table">
      {ORDEM_DIAS.map((dia) => {
        const treinosDoDia = treinosPorDia[dia];
        const ehHoje = dia === hoje;
        const descanso = treinosDoDia.length === 0;

        return (
          <section
            key={dia}
            className={`week-table__dia${ehHoje ? " week-table__dia--hoje" : ""}${descanso ? " week-table__dia--descanso" : ""}`}
          >
            <header className="week-table__cabecalho-dia">
              <h3>{LABEL_DIA[dia]}</h3>
              {ehHoje && (
                <span className="selo selo-sucesso week-table__selo-hoje">
                  <Flame size={12} strokeWidth={2.5} />
                  Hoje
                </span>
              )}
            </header>

            {descanso ? (
              <p className="week-table__descanso">
                <Moon size={16} strokeWidth={2} />
                Dia de descanso — nenhum treino cadastrado.
              </p>
            ) : (
              treinosDoDia.map((treino) => (
                <div key={treino.id} className="week-table__treino">
                  <p className="week-table__nome-treino">
                    <Dumbbell size={16} strokeWidth={2.25} />
                    {treino.nome}
                  </p>
                  <ExerciciosDoTreino treino={treino} />
                </div>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
