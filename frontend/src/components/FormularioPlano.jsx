import { useState } from "react";
import { criarPlano } from "../api/planos";
import "./FormularioCartao.css";

const VALOR_INICIAL = {
  nome: "",
  duracaoMeses: "",
  valor: "",
  descricao: "",
};

export function FormularioPlano({ onCriado, onCancelar }) {
  const [form, setForm] = useState(VALOR_INICIAL);
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const planoCriado = await criarPlano({
        nome: form.nome,
        duracaoMeses: Number(form.duracaoMeses),
        valor: Number(form.valor),
        descricao: form.descricao || null,
      });
      setForm(VALOR_INICIAL);
      onCriado(planoCriado);
    } catch (erroRequisicao) {
      const dados = erroRequisicao.response?.data;
      const mensagem = dados?.campos
        ? Object.values(dados.campos).join(" — ")
        : dados?.mensagem ?? "Não foi possível cadastrar o plano.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario-cartao entrada-suave" onSubmit={aoEnviar}>
      <h3>Novo plano</h3>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="formulario-cartao__grade">
        <div className="campo">
          <label htmlFor="fpl-nome">Nome</label>
          <input
            id="fpl-nome"
            value={form.nome}
            onChange={(e) => atualizarCampo("nome", e.target.value)}
            placeholder="Ex.: Mensal, Trimestral"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fpl-duracao">Duração (meses)</label>
          <input
            id="fpl-duracao"
            type="number"
            min="1"
            value={form.duracaoMeses}
            onChange={(e) => atualizarCampo("duracaoMeses", e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fpl-valor">Valor mensal (R$)</label>
          <input
            id="fpl-valor"
            type="number"
            min="0.01"
            step="0.01"
            value={form.valor}
            onChange={(e) => atualizarCampo("valor", e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fpl-descricao">Descrição</label>
          <input
            id="fpl-descricao"
            value={form.descricao}
            onChange={(e) => atualizarCampo("descricao", e.target.value)}
            placeholder="Benefícios do plano"
          />
        </div>
      </div>

      <div className="formulario-cartao__acoes">
        <button type="button" className="botao botao-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Cadastrando…" : "Cadastrar plano"}
        </button>
      </div>
    </form>
  );
}
