import client from "./client";

export function listarPagamentosPorMatricula(matriculaId) {
  return client.get("/pagamentos", { params: { matriculaId } }).then((res) => res.data);
}

export function gerarCobranca(dados) {
  return client.post("/pagamentos", dados).then((res) => res.data);
}

export function registrarPagamento(id, dados) {
  return client.patch(`/pagamentos/${id}/registrar-pagamento`, dados).then((res) => res.data);
}
