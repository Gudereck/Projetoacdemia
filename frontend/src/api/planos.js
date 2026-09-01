import client from "./client";

export function listarPlanos() {
  return client.get("/planos").then((res) => res.data);
}

export function listarPlanosPublico() {
  return client.get("/planos/publico").then((res) => res.data);
}

export function criarPlano(dados) {
  return client.post("/planos", dados).then((res) => res.data);
}

export function inativarPlano(id) {
  return client.patch(`/planos/${id}/inativar`);
}
