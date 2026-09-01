import client from "./client";

export function listarEquipamentos() {
  return client.get("/equipamentos").then((res) => res.data);
}

export function criarEquipamento(dados) {
  return client.post("/equipamentos", dados).then((res) => res.data);
}
