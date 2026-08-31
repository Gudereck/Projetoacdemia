import client from "./client";

export function listarTreinosPorAluno(alunoId) {
  return client.get("/treinos", { params: { alunoId } }).then((res) => res.data);
}
