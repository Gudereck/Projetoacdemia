# Sistema de Gestão de Academia — Requisitos

## 1. Visão Geral
Sistema web para gestão de academia, cobrindo cadastro de alunos, professores,
equipamentos, treinos e planos, com controle de acesso por perfil e controle
financeiro de mensalidades.

- **Tipo de aplicação:** Web
- **Banco de dados:** PostgreSQL
- **Perfis de acesso:** Admin, Professor, Aluno

## 2. Requisitos Funcionais

### RF01 — Autenticação e Perfis
- RF01.1 Login com e-mail/usuário e senha
- RF01.2 Três perfis: Admin, Professor, Aluno, cada um com permissões distintas
- RF01.3 Admin: acesso total (CRUD de todas as entidades)
- RF01.4 Professor: gerencia treinos dos seus alunos, consulta equipamentos
- RF01.5 Aluno: consulta seu próprio treino, plano e status de pagamento
- RF01.6 Recuperação de senha

### RF02 — Aluno
- RF02.1 CRUD de aluno (dados pessoais, contato, data de nascimento)
- RF02.2 Vincular aluno a um plano (matrícula)
- RF02.3 Inativar/reativar aluno (não excluir fisicamente — soft delete)
- RF02.4 Histórico de treinos do aluno
- RF02.5 Consultar status financeiro (pagamentos em dia/atrasados)

### RF03 — Professor
- RF03.1 CRUD de professor (dados pessoais, contato, especialidade, CREF)
- RF03.2 Vincular professor a treinos que ele monta/acompanha
- RF03.3 Inativar/reativar professor

### RF04 — Equipamentos
- RF04.1 CRUD de equipamento (nome, categoria, status, data de aquisição)
- RF04.2 Controle de status: disponível, em manutenção, inativo/quebrado
- RF04.3 Vincular equipamento a exercícios usados nos treinos
- RF04.4 Histórico de manutenção (opcional — fase 2)

### RF05 — Treinos
- RF05.1 Criar treino vinculado a um aluno e a um professor responsável
- RF05.2 Treino é composto por exercícios (nome, séries, repetições, carga, descanso)
- RF05.3 Cada exercício pode referenciar um equipamento
- RF05.4 Editar/atualizar treino ao longo do tempo (versionamento simples por data)
- RF05.5 Aluno visualiza apenas seu treino ativo

### RF06 — Planos
- RF06.1 CRUD de plano (nome, duração em meses, valor, benefícios/descrição)
- RF06.2 Matricular aluno em um plano (data início, data vencimento, plano contratado)
- RF06.3 Renovação de plano (gera novo período/matrícula)

### RF07 — Financeiro
- RF07.1 Gerar cobrança/mensalidade a partir do plano do aluno
- RF07.2 Registrar pagamento (data, valor, forma de pagamento, status)
- RF07.3 Status de pagamento: pendente, pago, atrasado
- RF07.4 Relatório de inadimplência (fase 2)

## 3. Requisitos Não Funcionais
- RNF01 Sistema web responsivo (desktop e mobile)
- RNF02 Senhas armazenadas com hash (bcrypt/argon2), nunca em texto puro
- RNF03 Banco de dados PostgreSQL
- RNF04 Autorização por perfil em todas as rotas/endpoints (não só na UI)
- RNF05 Auditoria básica: created_at/updated_at em todas as tabelas
- RNF06 Soft delete (campo ativo/deleted_at) em vez de exclusão física para aluno, professor e equipamento

## 4. Modelo de Dados (entidades)

Além das 5 tabelas solicitadas, foram incluídas 3 entidades de apoio,
necessárias para cobrir login e financeiro: **usuario**, **matricula** e
**pagamento**.

### usuario
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| nome | varchar | |
| email | varchar UNIQUE | login |
| senha_hash | varchar | |
| perfil | enum(admin, professor, aluno) | |
| aluno_id | FK → aluno.id | nullable |
| professor_id | FK → professor.id | nullable |
| ativo | boolean | default true |
| created_at / updated_at | timestamp | |

### aluno
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| nome | varchar | |
| cpf | varchar UNIQUE | |
| data_nascimento | date | |
| telefone | varchar | |
| email | varchar | |
| endereco | varchar | |
| ativo | boolean | soft delete |
| created_at / updated_at | timestamp | |

### professor
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| nome | varchar | |
| cpf | varchar UNIQUE | |
| cref | varchar | registro profissional |
| especialidade | varchar | |
| telefone | varchar | |
| email | varchar | |
| ativo | boolean | soft delete |
| created_at / updated_at | timestamp | |

### equipamento
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| nome | varchar | |
| categoria | varchar | ex: cardio, musculação livre, máquina |
| status | enum(disponivel, manutencao, inativo) | |
| data_aquisicao | date | |
| ativo | boolean | soft delete |
| created_at / updated_at | timestamp | |

### plano
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| nome | varchar | ex: Mensal, Trimestral, Anual |
| duracao_meses | integer | |
| valor | numeric(10,2) | |
| descricao | text | benefícios |
| ativo | boolean | |
| created_at / updated_at | timestamp | |

### matricula
Vincula aluno a um plano em um período específico.

| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| aluno_id | FK → aluno.id | |
| plano_id | FK → plano.id | |
| data_inicio | date | |
| data_vencimento | date | |
| status | enum(ativa, vencida, cancelada) | |
| created_at / updated_at | timestamp | |

### pagamento
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| matricula_id | FK → matricula.id | |
| valor | numeric(10,2) | |
| data_vencimento | date | |
| data_pagamento | date | nullable |
| forma_pagamento | varchar | pix, cartão, boleto, dinheiro |
| status | enum(pendente, pago, atrasado) | |
| created_at / updated_at | timestamp | |

### treino
| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| aluno_id | FK → aluno.id | |
| professor_id | FK → professor.id | |
| nome | varchar | ex: "Treino A - Peito/Tríceps" |
| data_inicio | date | |
| data_fim | date | nullable — treino atual não tem fim |
| ativo | boolean | |
| created_at / updated_at | timestamp | |

### treino_exercicio
Itens de um treino (relação N:N entre treino e equipamento, com dados próprios).

| Campo | Tipo | Observação |
|---|---|---|
| id | serial PK | |
| treino_id | FK → treino.id | |
| equipamento_id | FK → equipamento.id | nullable (exercício sem equipamento, ex: alongamento) |
| nome_exercicio | varchar | |
| series | integer | |
| repeticoes | integer | |
| carga_kg | numeric(5,2) | nullable |
| descanso_segundos | integer | |
| ordem | integer | ordem de execução no treino |

## 5. Relacionamentos (resumo)
- usuario 1:1 aluno (ou) usuario 1:1 professor
- aluno 1:N matricula
- plano 1:N matricula
- matricula 1:N pagamento
- aluno 1:N treino
- professor 1:N treino
- treino 1:N treino_exercicio
- equipamento 1:N treino_exercicio

## 6. Próximos Passos
1. Validar este levantamento com o usuário (você)
2. Desenhar o Diagrama Entidade-Relacionamento (DER)
3. Criar scripts de migração (PostgreSQL)
4. Definir stack do backend/frontend (não decidido ainda)
5. Priorizar RF07 (financeiro) e manutenção de equipamentos como fase 2, se necessário
