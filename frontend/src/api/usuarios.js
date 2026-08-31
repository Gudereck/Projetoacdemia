import client from "./client";

export function listarUsuarios() {
  return client.get("/usuarios").then((res) => res.data);
}

export function criarUsuario(dados) {
  return client.post("/usuarios", dados).then((res) => res.data);
}

export function inativarUsuario(id) {
  return client.patch(`/usuarios/${id}/inativar`);
}
