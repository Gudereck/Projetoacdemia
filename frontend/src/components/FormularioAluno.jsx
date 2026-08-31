import { useState } from "react";
import { criarAluno } from "../api/alunos";
import "./FormularioAluno.css";

const VALOR_INICIAL = {
  nome: "",
  cpf: "",
  dataNascimento: "",
  telefone: "",
  email: "",
  endereco: "",
};

export function FormularioAluno({ onCriado, onCancelar }) {
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
      const alunoCriado = await criarAluno({
        nome: form.nome,
        cpf: form.cpf,
        dataNascimento: form.dataNascimento,
        telefone: form.telefone || null,
        email: form.email || null,
        endereco: form.endereco || null,
      });
      setForm(VALOR_INICIAL);
      onCriado(alunoCriado);
    } catch (erroRequisicao) {
      const dados = erroRequisicao.response?.data;
      const mensagem = dados?.campos
        ? Object.values(dados.campos).join(" — ")
        : dados?.mensagem ?? "Não foi possível cadastrar o aluno.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao formulario-aluno entrada-suave" onSubmit={aoEnviar}>
      <h3>Novo aluno</h3>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="formulario-aluno__grade">
        <div className="campo">
          <label htmlFor="fa-nome">Nome</label>
          <input id="fa-nome" value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="fa-cpf">CPF (só números)</label>
          <input
            id="fa-cpf"
            value={form.cpf}
            onChange={(e) => atualizarCampo("cpf", e.target.value)}
            maxLength={11}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fa-nascimento">Data de nascimento</label>
          <input
            id="fa-nascimento"
            type="date"
            value={form.dataNascimento}
            onChange={(e) => atualizarCampo("dataNascimento", e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fa-telefone">Telefone</label>
          <input id="fa-telefone" value={form.telefone} onChange={(e) => atualizarCampo("telefone", e.target.value)} />
        </div>

        <div className="campo">
          <label htmlFor="fa-email">E-mail</label>
          <input
            id="fa-email"
            type="email"
            value={form.email}
            onChange={(e) => atualizarCampo("email", e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="fa-endereco">Endereço</label>
          <input id="fa-endereco" value={form.endereco} onChange={(e) => atualizarCampo("endereco", e.target.value)} />
        </div>
      </div>

      <div className="formulario-aluno__acoes">
        <button type="button" className="botao botao-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Cadastrando…" : "Cadastrar aluno"}
        </button>
      </div>
    </form>
  );
}
