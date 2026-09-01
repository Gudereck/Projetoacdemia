import { useState } from "react";
import { criarEquipamento } from "../api/equipamentos";
import { hojeISO } from "../utils/data";
import "./FormularioCartao.css";

const VALOR_INICIAL = {
  nome: "",
  categoria: "",
  status: "DISPONIVEL",
  dataAquisicao: hojeISO(),
};

export function FormularioEquipamento({ onCriado, onCancelar }) {
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
      const equipamentoCriado = await criarEquipamento({
        nome: form.nome,
        categoria: form.categoria,
        status: form.status,
        dataAquisicao: form.dataAquisicao,
      });
      setForm(VALOR_INICIAL);
      onCriado(equipamentoCriado);
    } catch (erroRequisicao) {
      const dados = erroRequisicao.response?.data;
      const mensagem = dados?.campos
        ? Object.values(dados.campos).join(" — ")
        : dados?.mensagem ?? "Não foi possível cadastrar o equipamento.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario-cartao entrada-suave" onSubmit={aoEnviar}>
      <h3>Novo equipamento</h3>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="formulario-cartao__grade">
        <div className="campo">
          <label htmlFor="fe-nome">Nome</label>
          <input
            id="fe-nome"
            value={form.nome}
            onChange={(e) => atualizarCampo("nome", e.target.value)}
            placeholder="Ex.: Esteira, Supino reto"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fe-categoria">Categoria</label>
          <input
            id="fe-categoria"
            value={form.categoria}
            onChange={(e) => atualizarCampo("categoria", e.target.value)}
            placeholder="Ex.: Cardio, Musculação"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fe-status">Status</label>
          <select id="fe-status" value={form.status} onChange={(e) => atualizarCampo("status", e.target.value)}>
            <option value="DISPONIVEL">Disponível</option>
            <option value="MANUTENCAO">Manutenção</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="fe-data">Data de aquisição</label>
          <input
            id="fe-data"
            type="date"
            max={hojeISO()}
            value={form.dataAquisicao}
            onChange={(e) => atualizarCampo("dataAquisicao", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="formulario-cartao__acoes">
        <button type="button" className="botao botao-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Cadastrando…" : "Cadastrar equipamento"}
        </button>
      </div>
    </form>
  );
}
