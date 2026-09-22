# API — referência de endpoints

Base URL local: `http://localhost:8080`. Todas as respostas são JSON.

## Autenticação

A API usa **JWT** via header `Authorization: Bearer <token>`. Só dois
endpoints não exigem token:

- `POST /api/auth/login`
- `GET /api/planos/publico` (usado pela home pública)

Qualquer outra rota sem token (ou com token inválido/expirado) responde
`401 Unauthorized`. Autorização por perfil é feita nos controllers com
`@PreAuthorize` — um usuário autenticado mas sem o perfil exigido recebe
`403 Forbidden`.

### `POST /api/auth/login`
```json
// request
{ "email": "admin@academia.local", "senha": "admin123" }

// response 200
{ "token": "eyJhbGciOi...", "tipo": "Bearer" }
```
Login errado → `401`. Conta inativa → `403`. Conta bloqueada por excesso de
tentativas → `423 Locked` (ver `LoginAttemptListener`).

### `GET /api/auth/me`
Retorna os dados do usuário autenticado (a partir do token).
```json
{ "id": 1, "nome": "Administrador", "email": "admin@academia.local",
  "perfil": "ADMIN", "alunoId": null, "professorId": null }
```

## Perfis (`PerfilUsuario`)

`ADMIN`, `PROFESSOR`, `ATENDENTE`, `ALUNO`. Um `usuario` opcionalmente se
vincula a um `aluno` ou `professor` (`alunoId`/`professorId` em `MeResponse`)
— é assim que o backend sabe "de quem" é o login de perfil `ALUNO`.

## Formato de erro

Todo erro de negócio/validação segue o mesmo formato:
```json
{ "timestamp": "...", "status": 400, "erro": "Bad Request",
  "mensagem": "Dados inválidos",
  "campos": { "cpf": "CPF deve conter 11 dígitos numéricos" } }
```
`campos` só aparece em erro de validação de request body (`400`). Outros
status usados: `404` (recurso não encontrado), `409` (CPF/e-mail duplicado),
`423` (conta bloqueada), `403` (sem permissão ou usuário inativo).

## Endpoints por recurso

### Alunos — `/api/alunos`
| Método | Rota | Perfis | Descrição |
|---|---|---|---|
| GET | `/api/alunos` | ADMIN, PROFESSOR, ATENDENTE | Lista alunos |
| GET | `/api/alunos/{id}` | ADMIN, PROFESSOR, ATENDENTE | Busca por id |
| POST | `/api/alunos` | ADMIN, ATENDENTE | Cria aluno |
| PUT | `/api/alunos/{id}` | ADMIN, ATENDENTE | Atualiza aluno |
| PATCH | `/api/alunos/{id}/inativar` | ADMIN | Soft delete |
| PATCH | `/api/alunos/{id}/reativar` | ADMIN | Reverte soft delete |

`AlunoRequest`: `nome*`, `cpf*` (11 dígitos), `dataNascimento*` (passado),
`telefone`, `email` (formato válido), `endereco`.

### Professores — `/api/professores` (ADMIN em todas as rotas)
Mesmo CRUD (GET lista/id, POST, PUT, inativar/reativar).
`ProfessorRequest`: `nome*`, `cpf*`, `cref*`, `especialidade`, `telefone`,
`email`.

### Equipamentos — `/api/equipamentos` (ADMIN em todas as rotas)
Mesmo CRUD. `EquipamentoRequest`: `nome*`, `categoria*`,
`status*` (`DISPONIVEL`/`MANUTENCAO`/`INATIVO`), `dataAquisicao*`
(hoje ou passado).

### Planos — `/api/planos`
| Método | Rota | Perfis | Descrição |
|---|---|---|---|
| GET | `/api/planos` | ADMIN, ATENDENTE | Lista todos os planos |
| GET | `/api/planos/publico` | **público** | Planos ativos, para a home |
| GET | `/api/planos/{id}` | ADMIN, ATENDENTE | Busca por id |
| POST | `/api/planos` | ADMIN | Cria plano |
| PUT | `/api/planos/{id}` | ADMIN | Atualiza plano |
| PATCH | `/api/planos/{id}/inativar` | ADMIN | Soft delete |
| PATCH | `/api/planos/{id}/reativar` | ADMIN | Reverte soft delete |

`PlanoRequest`: `nome*`, `duracaoMeses*` (> 0), `valor*` (> 0), `descricao`.

### Usuários — `/api/usuarios`
| Método | Rota | Perfis | Descrição |
|---|---|---|---|
| GET | `/api/usuarios` | ADMIN | Lista logins |
| GET | `/api/usuarios/{id}` | ADMIN | Busca por id |
| POST | `/api/usuarios` | ADMIN, ATENDENTE | Cria login (recepção cria login do aluno) |
| PATCH | `/api/usuarios/{id}/inativar` | ADMIN | Desativa login |
| PATCH | `/api/usuarios/{id}/reativar` | ADMIN | Reativa login |

`UsuarioRequest`: `nome*`, `email*`, `senha*` (8–72 caracteres), `perfil*`,
`alunoId`, `professorId` (vincula o login a um aluno/professor existente).

### Matrículas — `/api/matriculas` (ADMIN, ATENDENTE)
| Método | Rota | Perfis extra | Descrição |
|---|---|---|---|
| GET | `/api/matriculas` | — | Lista matrículas |
| GET | `/api/matriculas/{id}` | — | Busca por id |
| POST | `/api/matriculas` | — | Matricula aluno em um plano |
| POST | `/api/matriculas/{id}/renovar` | ADMIN | Gera nova matrícula/período |
| PATCH | `/api/matriculas/{id}/cancelar` | ADMIN | Cancela matrícula |

`MatriculaRequest`: `alunoId*`, `planoId*`, `dataInicio*`. `status`
(`ATIVA`/`VENCIDA`/`CANCELADA`) e `dataVencimento` são calculados no backend
a partir da duração do plano.

### Pagamentos — `/api/pagamentos` (ADMIN, ATENDENTE)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/pagamentos` | Lista cobranças |
| GET | `/api/pagamentos/{id}` | Busca por id |
| POST | `/api/pagamentos` | Gera cobrança para uma matrícula |
| PATCH | `/api/pagamentos/{id}/registrar-pagamento` | Marca como pago |

`PagamentoRequest`: `matriculaId*`, `dataVencimento*`.
`RegistrarPagamentoRequest` (body do PATCH): `dataPagamento*`,
`formaPagamento*` (texto livre: pix, cartão, boleto, dinheiro...).

### Treinos — `/api/treinos` (ADMIN, PROFESSOR, ALUNO)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/treinos?alunoId=` | Lista treinos ativos de um aluno |
| GET | `/api/treinos/{id}` | Busca um treino |
| POST | `/api/treinos` | Cria treino (vincula aluno + professor + dia da semana) |
| PATCH | `/api/treinos/{id}/encerrar` | Encerra o treino (define `dataFim`) |
| POST | `/api/treinos/{treinoId}/exercicios` | Adiciona exercício ao treino |
| DELETE | `/api/treinos/{treinoId}/exercicios/{exercicioId}` | Remove exercício |

Um usuário `ALUNO` só acessa (`GET`) os treinos do **próprio** `alunoId` —
tentar ver o treino de outro aluno responde `403` (checado no controller via
`principal.getUsuario().getAluno()`, não confiar em nada vindo do cliente).

`TreinoRequest`: `alunoId*`, `professorId*`, `nome*`, `diaSemana*`
(`SEGUNDA`…`DOMINGO`), `dataInicio*`.
`TreinoExercicioRequest`: `equipamentoId` (opcional — exercício sem
equipamento, ex. alongamento), `nomeExercicio*`, `series*` (> 0),
`repeticoes*` (> 0), `cargaKg`, `descansoSegundos`, `ordem*`.

## Referência cruzada

Para o modelo de dados por trás desses recursos, ver
[`requisitos.md`](requisitos.md#4-modelo-de-dados-entidades). Para a
arquitetura (camadas, fluxo do JWT, estrutura do frontend), ver
[`arquitetura.md`](arquitetura.md).
