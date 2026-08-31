import client from "./client";

export function listarAlunos() {
  return client.get("/alunos").then((res) => res.data);
}

export function buscarAluno(id) {
  return client.get(`/alunos/${id}`).then((res) => res.data);
}

export function criarAluno(dados) {
  return client.post("/alunos", dados).then((res) => res.data);
}

export function atualizarAluno(id, dados) {
  return client.put(`/alunos/${id}`, dados).then((res) => res.data);
}
