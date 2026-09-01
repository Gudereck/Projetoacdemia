// new Date().toISOString() converte pra UTC — à noite no Brasil (UTC-3) isso
// já cai no dia seguinte em UTC, fazendo o backend rejeitar a data como
// futura em validações de "não pode ser no futuro". Montamos a data com os
// componentes do fuso local em vez disso.
export function hojeISO() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
