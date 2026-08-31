import { useState } from "react";
import { criarUsuario } from "../api/usuarios";
import "./FormularioUsuario.css";

const VALOR_INICIAL = {
  nome: "",
  email: "",
  senha: "",
  perfil: "ALUNO",
  vinculoId: "",
};

export function FormularioUsuario({ alunos, professores, onCriado, onCancelar }) {
  const [form, setForm] = useState(VALOR_INICIAL);
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor, ...(campo === "perfil" ? { vinculoId: "" } : {}) }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const payload = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      perfil: form.perfil,
      alunoId: form.perfil === "ALUNO" && form.vinculoId ? Number(form.vinculoId) : null,
      professorId: form.perfil === "PROFESSOR" && form.vinculoId ? Number(form.vinculoId) : null,
    };

    try {
      const usuarioCriado = await criarUsuario(payload);
      setForm(VALOR_INICIAL);
      onCriado(usuarioCriado);
    } catch (erroRequisicao) {
      const dados = erroRequisicao.response?.data;
      const mensagem = dados?.campos
        ? Object.values(dados.campos).join(" — ")
        : dados?.mensagem ?? "Não foi possível criar o usuário.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  const precisaVinculo = form.perfil === "ALUNO" || form.perfil === "PROFESSOR";
  const opcoesVinculo = form.perfil === "ALUNO" ? alunos : form.perfil === "PROFESSOR" ? professores : [];

  return (
    <form className="cartao formulario-usuario entrada-suave" onSubmit={aoEnviar}>
      <h3>Novo usuário</h3>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="formulario-usuario__grade">
        <div className="campo">
          <label htmlFor="fu-nome">Nome</label>
          <input
            id="fu-nome"
            value={form.nome}
            onChange={(e) => atualizarCampo("nome", e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fu-email">E-mail</label>
          <input
            id="fu-email"
            type="email"
            value={form.email}
            onChange={(e) => atualizarCampo("email", e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fu-senha">Senha</label>
          <input
            id="fu-senha"
            type="password"
            minLength={8}
            value={form.senha}
            onChange={(e) => atualizarCampo("senha", e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="fu-perfil">Perfil</label>
          <select
            id="fu-perfil"
            value={form.perfil}
            onChange={(e) => atualizarCampo("perfil", e.target.value)}
          >
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
            <option value="ATENDENTE">Atendente</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {precisaVinculo && (
          <div className="campo">
            <label htmlFor="fu-vinculo">
              {form.perfil === "ALUNO" ? "Qual aluno?" : "Qual professor?"}
            </label>
            <select
              id="fu-vinculo"
              value={form.vinculoId}
              onChange={(e) => atualizarCampo("vinculoId", e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione…
              </option>
              {opcoesVinculo.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="formulario-usuario__acoes">
        <button type="button" className="botao botao-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Criando…" : "Criar usuário"}
        </button>
      </div>
    </form>
  );
}
