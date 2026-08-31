import client from "./client";

export function listarMatriculasPorAluno(alunoId) {
  return client.get("/matriculas", { params: { alunoId } }).then((res) => res.data);
}

export function criarMatricula(dados) {
  return client.post("/matriculas", dados).then((res) => res.data);
}
