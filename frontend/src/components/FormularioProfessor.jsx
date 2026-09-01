import { useState } from "react";
import { criarProfessor } from "../api/professores";
import "./FormularioCartao.css";

const VALOR_INICIAL = {
  nome: "",
  cpf: "",
  cref: "",
  especialidade: "",
  telefone: "",
  email: "",
};

export function FormularioProfessor({ onCriado, onCancelar }) {
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
      const professorCriado = await criarProfessor({
        nome: form.nome,
        cpf: form.cpf,
        cref: form.cref,
        especialidade: form.especialidade || null,
        telefone: form.telefone || null,
        email: form.email || null,
      });
      setForm(VALOR_INICIAL);
      onCriado(professorCriado);
    } catch (erroRequisicao) {
      const dados = erroRequisicao.response?.data;
      const mensagem = dados?.campos
        ? Object.values(dados.campos).join(" — ")
        : dados?.mensagem ?? "Não foi possível cadastrar o professor.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario-cartao entrada-suave" onSubmit={aoEnviar}>
      <h3>Novo professor</h3>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="formulario-cartao__grade">
        <div className="campo">
          <label htmlFor="fp-nome">Nome</label>
          <input id="fp-nome" value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="fp-cpf">CPF (só números)</label>
          <input
            id="fp-cpf"
            value={form.cpf}
            onChange={(e) => atualizarCampo("cpf", e.target.value)}
            maxLength={11}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fp-cref">CREF</label>
          <input id="fp-cref" value={form.cref} onChange={(e) => atualizarCampo("cref", e.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="fp-especialidade">Especialidade</label>
          <input
            id="fp-especialidade"
            value={form.especialidade}
            onChange={(e) => atualizarCampo("especialidade", e.target.value)}
            placeholder="Ex.: Musculação"
          />
        </div>

        <div className="campo">
          <label htmlFor="fp-telefone">Telefone</label>
          <input
            id="fp-telefone"
            value={form.telefone}
            onChange={(e) => atualizarCampo("telefone", e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="fp-email">E-mail</label>
          <input
            id="fp-email"
            type="email"
            value={form.email}
            onChange={(e) => atualizarCampo("email", e.target.value)}
          />
        </div>
      </div>

      <div className="formulario-cartao__acoes">
        <button type="button" className="botao botao-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Cadastrando…" : "Cadastrar professor"}
        </button>
      </div>
    </form>
  );
}
