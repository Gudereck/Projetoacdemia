import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { criarUsuario } from "../api/usuarios";
import { criarMatricula, listarMatriculasPorAluno } from "../api/matriculas";
import { gerarCobranca, listarPagamentosPorMatricula, registrarPagamento } from "../api/pagamentos";
import "./PainelAcoesAluno.css";

const FORMAS_PAGAMENTO = ["pix", "cartão", "boleto", "dinheiro"];

const ROTULO_STATUS_MATRICULA = {
  ATIVA: "selo-sucesso",
  VENCIDA: "selo-neutro",
  CANCELADA: "selo-neutro",
};

const ROTULO_STATUS_PAGAMENTO = {
  PAGO: "selo-sucesso",
  PENDENTE: "selo-neutro",
  ATRASADO: "selo-neutro",
};

function SecaoLogin({ aluno }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function criar(evento) {
    evento.preventDefault();
    setStatus(null);
    setEnviando(true);
    try {
      await criarUsuario({
        nome: aluno.nome,
        email,
        senha,
        perfil: "ALUNO",
        alunoId: aluno.id,
        professorId: null,
      });
      setStatus({ tipo: "ok", texto: "Login criado com sucesso." });
      setEmail("");
      setSenha("");
    } catch (erroRequisicao) {
      setStatus({
        tipo: "erro",
        texto: erroRequisicao.response?.data?.mensagem ?? "Não foi possível criar o login.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="painel-aluno__secao">
      <h4>Login do aluno</h4>
      <form className="painel-aluno__form-linha" onSubmit={criar}>
        <div className="campo">
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Senha</label>
          <input type="password" minLength={8} value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Criando…" : "Criar login"}
        </button>
      </form>
      {status && (
        <p className={status.tipo === "erro" ? "painel-aluno__status-erro" : "painel-aluno__status-ok"}>
          {status.texto}
        </p>
      )}
    </section>
  );
}

function SecaoMatricula({ aluno, planos, matriculas, aoMatricular }) {
  const [planoId, setPlanoId] = useState("");
  const [dataInicio, setDataInicio] = useState(() => new Date().toISOString().slice(0, 10));
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function matricular(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const nova = await criarMatricula({ alunoId: aluno.id, planoId: Number(planoId), dataInicio });
      aoMatricular(nova);
      setPlanoId("");
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível matricular.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="painel-aluno__secao">
      <h4>Matrícula</h4>

      {matriculas.length > 0 && (
        <ul className="painel-aluno__lista-matriculas">
          {matriculas.map((m) => (
            <li key={m.id}>
              <span>{m.planoNome}</span>
              <span className="painel-aluno__periodo">
                {m.dataInicio} → {m.dataVencimento}
              </span>
              <span className={`selo ${ROTULO_STATUS_MATRICULA[m.status] ?? "selo-neutro"}`}>{m.status}</span>
            </li>
          ))}
        </ul>
      )}

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form className="painel-aluno__form-linha" onSubmit={matricular}>
        <div className="campo">
          <label>Plano</label>
          <select value={planoId} onChange={(e) => setPlanoId(e.target.value)} required>
            <option value="" disabled>
              Selecione…
            </option>
            {planos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — R$ {Number(p.valor).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label>Data de início</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        </div>
        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? "Matriculando…" : "Matricular"}
        </button>
      </form>
    </section>
  );
}

function SecaoPagamento({ matriculas }) {
  const [matriculaId, setMatriculaId] = useState("");
  const [pagamentos, setPagamentos] = useState([]);
  const [dataVencimento, setDataVencimento] = useState(() => new Date().toISOString().slice(0, 10));
  const [erro, setErro] = useState(null);
  const [registrandoId, setRegistrandoId] = useState(null);
  const [dataPagamento, setDataPagamento] = useState(() => new Date().toISOString().slice(0, 10));
  const [formaPagamento, setFormaPagamento] = useState(FORMAS_PAGAMENTO[0]);

  useEffect(() => {
    if (!matriculaId) {
      setPagamentos([]);
      return;
    }
    listarPagamentosPorMatricula(matriculaId).then(setPagamentos);
  }, [matriculaId]);

  async function aoGerarCobranca(evento) {
    evento.preventDefault();
    setErro(null);
    try {
      const novo = await gerarCobranca({ matriculaId: Number(matriculaId), dataVencimento });
      setPagamentos((atual) => [...atual, novo]);
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível gerar a cobrança.");
    }
  }

  async function confirmarPagamento(pagamentoId) {
    setErro(null);
    try {
      const atualizado = await registrarPagamento(pagamentoId, { dataPagamento, formaPagamento });
      setPagamentos((atual) => atual.map((p) => (p.id === pagamentoId ? atualizado : p)));
      setRegistrandoId(null);
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem ?? "Não foi possível registrar o pagamento.");
    }
  }

  if (matriculas.length === 0) {
    return (
      <section className="painel-aluno__secao">
        <h4>Pagamento</h4>
        <p className="painel-aluno__aviso">Matricule o aluno em um plano primeiro.</p>
      </section>
    );
  }

  return (
    <section className="painel-aluno__secao">
      <h4>Pagamento</h4>

      <div className="campo">
        <label>Matrícula</label>
        <select value={matriculaId} onChange={(e) => setMatriculaId(e.target.value)}>
          <option value="" disabled>
            Selecione…
          </option>
          {matriculas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.planoNome} ({m.dataInicio} → {m.dataVencimento})
            </option>
          ))}
        </select>
      </div>

      {matriculaId && (
        <>
          {erro && <div className="mensagem-erro">{erro}</div>}

          {pagamentos.length > 0 && (
            <ul className="painel-aluno__lista-pagamentos">
              {pagamentos.map((p) => (
                <li key={p.id}>
                  <div className="painel-aluno__linha-pagamento">
                    <span className="numero">R$ {Number(p.valor).toFixed(2)}</span>
                    <span>vence {p.dataVencimento}</span>
                    <span className={`selo ${ROTULO_STATUS_PAGAMENTO[p.status] ?? "selo-neutro"}`}>{p.status}</span>
                    {p.status === "PENDENTE" && registrandoId !== p.id && (
                      <button type="button" className="botao botao-secundario" onClick={() => setRegistrandoId(p.id)}>
                        Registrar
                      </button>
                    )}
                  </div>
                  {registrandoId === p.id && (
                    <div className="painel-aluno__form-registrar">
                      <div className="campo">
                        <label>Data do pagamento</label>
                        <input
                          type="date"
                          value={dataPagamento}
                          onChange={(e) => setDataPagamento(e.target.value)}
                        />
                      </div>
                      <div className="campo">
                        <label>Forma de pagamento</label>
                        <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                          {FORMAS_PAGAMENTO.map((forma) => (
                            <option key={forma} value={forma}>
                              {forma}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        className="botao botao-primario"
                        onClick={() => confirmarPagamento(p.id)}
                      >
                        Confirmar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form className="painel-aluno__form-linha" onSubmit={aoGerarCobranca}>
            <div className="campo">
              <label>Nova cobrança — vencimento</label>
              <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} required />
            </div>
            <button type="submit" className="botao botao-secundario">
              Gerar cobrança
            </button>
          </form>
        </>
      )}
    </section>
  );
}

export function PainelAcoesAluno({ aluno, planos, onFechar }) {
  const [matriculas, setMatriculas] = useState([]);

  useEffect(() => {
    listarMatriculasPorAluno(aluno.id).then(setMatriculas);
  }, [aluno.id]);

  return (
    <div className="cartao painel-aluno entrada-suave">
      <header className="painel-aluno__cabecalho">
        <h3>{aluno.nome}</h3>
        <button type="button" className="painel-aluno__fechar" onClick={onFechar} aria-label="Fechar">
          <X size={18} />
        </button>
      </header>

      <SecaoLogin aluno={aluno} />
      <SecaoMatricula
        aluno={aluno}
        planos={planos}
        matriculas={matriculas}
        aoMatricular={(nova) => setMatriculas((atual) => [...atual, nova])}
      />
      <SecaoPagamento matriculas={matriculas} />
    </div>
  );
}
