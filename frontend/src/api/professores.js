import client from "./client";

export function listarProfessores() {
  return client.get("/professores").then((res) => res.data);
}
