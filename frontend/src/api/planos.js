import client from "./client";

export function listarPlanos() {
  return client.get("/planos").then((res) => res.data);
}

export function inativarPlano(id) {
  return client.patch(`/planos/${id}/inativar`);
}
