# 📝 Todo List API - Docker + Redis + Supabase

Uma API robusta para gerenciamento de tarefas (Todo List) desenvolvida com Node.js, conteinerizada com Docker, otimizada com Redis para caching e integrada ao Supabase para armazenamento de arquivos.

Este projeto demonstra a implementação de uma arquitetura escalável utilizando práticas modernas de desenvolvimento backend.

## 🚀 Funcionalidades

- **Autenticação JWT**: Registro e Login seguro com hash de senha (Bcrypt) e tokens de acesso (JWT).

- **CRUD de Tarefas**: Criação, leitura, atualização e remoção de tarefas.

- **Cache Estratégico (Redis)**: Implementação do padrão Cache-Aside na listagem de tarefas para reduzir a carga no banco de dados.
  - **Cache Hit**: Retorno instantâneo do Redis.
  - **Cache Miss**: Busca no banco e atualização do cache.
  - **Invalidação**: Limpeza automática do cache ao criar, editar ou excluir tarefas.

- **Upload de Arquivos (Supabase)**: Upload de avatar do usuário via multipart/form-data, processamento em memória com Multer e envio para bucket no Supabase Storage.

- **Infraestrutura Docker**: Ambiente completo (API, Banco, Cache, Frontend) orquestrado via Docker Compose.

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL (via Sequelize ORM)
- **Cache**: Redis
- **Storage**: Supabase Storage
- **Containerização**: Docker & Docker Compose
- **Segurança**: Bcrypt.js, JsonWebToken (JWT)
- **Outros**: Multer (Uploads), Dotenv

## 📂 Arquitetura do Projeto

```
backend/
├── src/
│   ├── config/         # Configurações (Redis, Supabase, Multer, Database)
│   ├── controllers/    # Lógica das rotas (Auth, Task, Profile)
│   ├── middleware/     # Interceptadores (Autenticação JWT)
│   ├── migrations/     # Scripts de banco de dados (.cjs)
│   ├── models/         # Modelos Sequelize (User, Task)
│   └── ...
├── server.js           # Ponto de entrada da API
└── Dockerfile          # Configuração da imagem Docker
docker-compose.yml      # Orquestração dos serviços
```

## ⚙️ Pré-requisitos

- Docker e Docker Compose instalados.
- Uma conta no Supabase (para o bucket de imagens).

## 🚀 Como Rodar

### 1. Configuração de Ambiente

Certifique-se de que o arquivo `docker-compose.yml` (ou um arquivo `.env` na raiz) contenha as variáveis necessárias, especialmente as do Supabase:

```yaml
# docker-compose.yml (trecho)
environment:
  SUPABASE_URL: "sua_url_do_projeto_supabase"
  SUPABASE_KEY: "sua_chave_anon_publica"
  JWT_SECRET: "sua_chave_secreta"
  # ... configurações do Postgres e Redis
```

### 2. Iniciar os Serviços

Na raiz do projeto, execute:

```bash
docker-compose up --build -d
```

Isso irá:
- Construir as imagens do Backend e Frontend.
- Baixar as imagens do Postgres e Redis.
- Iniciar todos os containers em rede.
- Rodar as migrations do banco de dados automaticamente.

### 3. Verificar Logs

Para garantir que o backend subiu corretamente e conectou aos serviços:

```bash
docker logs -f backend-pweb
```

**Esperado**: `Server is running on port 3000` e `Conectado ao Redis com sucesso!`.

## 📡 Endpoints da API

A API roda em `http://localhost:3000`.

### Autenticação (Público)

| Método | Rota | Descrição | Body (JSON) |
|--------|------|-----------|-------------|
| POST | `/signup` | Cria novo usuário | `{ "name": "...", "email": "...", "password": "..." }` |
| POST | `/signin` | Login e gera Token | `{ "email": "...", "password": "..." }` |

### Tarefas (Privado - Requer Header `Authorization: Bearer <TOKEN>`)

| Método | Rota | Descrição | Body (JSON) |
|--------|------|-----------|-------------|
| GET | `/tasks` | Lista tarefas (Usa Cache) | - |
| POST | `/tasks` | Cria tarefa (Limpa Cache) | `{ "description": "..." }` |
| PUT | `/tasks/:id` | Atualiza tarefa | `{ "description": "...", "completed": true }` |
| DELETE | `/tasks/:id` | Remove tarefa | - |

### Perfil (Privado)

| Método | Rota | Descrição | Formato |
|--------|------|-----------|---------|
| PATCH | `/profile/avatar` | Upload de foto de perfil | Multipart Form (Campo: `file`) |

## 🧪 Testando o Cache (Redis)

1. Faça um `GET /tasks`. Verifique os logs do container: 🐢 **Cache MISS** (Buscou no banco).
2. Faça outro `GET /tasks` imediatamente. Verifique os logs: ⚡ **Cache HIT** (Retornou do Redis instantaneamente).

---

**Desenvolvido para um projeto academico feito por @domcarlosadriano e meu amigo Mateus Victor.**