import client from "./client";

export function listarProfessores() {
  return client.get("/professores").then((res) => res.data);
}

export function criarProfessor(dados) {
  return client.post("/professores", dados).then((res) => res.data);
}
