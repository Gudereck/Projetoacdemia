# Arquitetura

## Visão geral

```
frontend/  (React + Vite, SPA)  ──HTTP/JSON──▶  backend/ (Spring Boot API REST)  ──JDBC──▶  Postgres (db)
                                                                                              └─ réplica de leitura (db-replica)
```

O backend expõe uma API REST stateless protegida por JWT; o frontend é uma
SPA que guarda o token no `localStorage` e o envia em todo request. Não há
server-side rendering nem sessão no servidor.

## Backend (Spring Boot)

Pacote raiz: `Academia.Projeto`. Organizado em camadas clássicas:

```
controller/   Endpoints REST — validação de entrada (@Valid), @PreAuthorize por perfil
service/      Regras de negócio, transações
repository/   Spring Data JPA (interfaces)
entity/       Entidades JPA (tabelas)
dto/          Records de request/response — nunca expõe entidade direto na API
security/     JWT (geração/validação), filtro de autenticação, UserDetailsService
config/       SecurityConfig, AdminBootstrapRunner
exception/    Exceções de negócio + GlobalExceptionHandler (@RestControllerAdvice)
```

Fluxo típico de uma requisição autenticada:

1. `JwtAuthenticationFilter` intercepta o request, extrai o `Bearer <token>`
   do header `Authorization`.
2. Valida o token com `JwtService` e carrega o `Usuario` via
   `UsuarioDetailsService` → popula o `SecurityContext` com um
   `UsuarioPrincipal`.
3. O controller roda `@PreAuthorize("hasAnyRole(...)")` contra o perfil do
   usuário autenticado.
4. Controller delega para o `service`, que aplica regras de negócio e usa o
   `repository` para persistir/consultar.
5. Erros de negócio (`RecursoNaoEncontradoException`,
   `CpfDuplicadoException`, `RegraDeNegocioException`, etc.) são convertidos
   em respostas JSON padronizadas pelo `GlobalExceptionHandler`.

Login (`POST /api/auth/login`) é o único fluxo que não passa pelo filtro JWT
na entrada: usa o `AuthenticationManager` do Spring Security diretamente
(usuário/senha), e só gera o token na resposta.

### Segurança

- Senhas com `PasswordEncoderFactories.createDelegatingPasswordEncoder()`
  (bcrypt por padrão) — nunca texto puro.
- Sessão stateless (`SessionCreationPolicy.STATELESS`) — toda autorização
  vem do token, não de sessão de servidor.
- `LoginAttemptListener` bloqueia a conta por 15 minutos após 5 tentativas
  de senha erradas seguidas (evento do Spring Security,
  `AuthenticationFailureBadCredentialsEvent`/`AuthenticationSuccessEvent`).
- CORS liberado apenas para `http://localhost:5173` (origem do Vite em dev)
  em `SecurityConfig`.
- `AdminBootstrapRunner` cria um usuário `ADMIN` automaticamente na primeira
  subida com banco vazio (`app.admin.email`/`app.admin.password`, via
  `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

Detalhes de cada endpoint, DTOs e regras de acesso por perfil:
[`api.md`](api.md).

### Banco de dados

Migrações versionadas com **Flyway**
(`backend/src/main/resources/db/migration/V1__...` a `V12__...`), aplicadas
automaticamente no boot (`spring.flyway.enabled=true`). O modelo de dados
(tabelas, relacionamentos) está detalhado em
[`requisitos.md`](requisitos.md#4-modelo-de-dados-entidades).

Infraestrutura local roda dois containers Postgres (primário + réplica de
leitura via streaming replication) — ver
[`infraestrutura-bd.md`](infraestrutura-bd.md). A aplicação sempre escreve e
lê do primário; a réplica existe para redundância, não é usada pela
aplicação hoje.

## Frontend (React + Vite)

```
src/
  api/          Um módulo por recurso (alunos.js, planos.js, ...) — wrappers do axios
  api/client.js Instância axios: injeta o Bearer token, redireciona pro /login em 401
  auth/         AuthContext (estado do usuário logado) + RequireAuth (guarda de rota)
  components/   Componentes reutilizáveis (formulários, layout, tabelas, cards)
  pages/        Uma página por rota/perfil
  styles/       Tema (CSS vars)
```

### Roteamento e controle de acesso (`App.jsx`)

- `/` — home pública (planos vêm de `GET /api/planos/publico`, sem login).
- `/login` — formulário de login.
- Todo o resto fica atrás de `<RequireAuth>`, que:
  - redireciona para `/login` se não houver usuário autenticado
    (`AuthContext`);
  - opcionalmente recebe `perfis={[...]}` e bloqueia o acesso se o perfil do
    usuário logado não estiver na lista (ex.: `/recepcao` só para
    `ATENDENTE`).
- Rotas por perfil: `/meu-treino` (ALUNO), `/professor` e
  `/professor/alunos/:alunoId` (PROFESSOR/ADMIN), `/admin` e
  `/admin/alunos/:alunoId` (ADMIN), `/recepcao` (ATENDENTE).

Importante: essas guardas de rota são só UX — a autorização de verdade
acontece no backend (`@PreAuthorize`), então nenhuma delas pode ser tratada
como controle de segurança por si só.

### Autenticação no cliente (`AuthContext` + `api/client.js`)

1. Token JWT fica em `localStorage` (`token`).
2. Ao montar a aplicação, se houver token salvo, `AuthContext` chama
   `GET /api/auth/me` para recarregar os dados do usuário — se o token for
   inválido/expirado, ele é descartado silenciosamente.
3. Toda requisição do axios injeta `Authorization: Bearer <token>`
   automaticamente (interceptor em `api/client.js`).
4. Qualquer resposta `401` limpa o token e redireciona para `/login` —
   tratamento centralizado, nenhuma página precisa cuidar disso.

## Rodando localmente

Passo a passo completo (banco, backend, frontend) está no
[`README.md`](../README.md#como-rodar) da raiz do projeto.
