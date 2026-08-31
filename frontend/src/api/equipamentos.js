import client from "./client";

export function listarEquipamentos() {
  return client.get("/equipamentos").then((res) => res.data);
}
