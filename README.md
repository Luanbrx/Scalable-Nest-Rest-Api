# Scalable Nest Rest API

API REST escalável para gerenciamento de tarefas, construída com NestJS, Prisma ORM e autenticação JWT.

---

## 📚 Documentação

Com o servidor rodando, acesse a documentação Swagger em:

```
http://localhost:3001/docs
```

---

## 🚀 Tecnologias

| Tecnologia | Função |
|---|---|
| [NestJS](https://nestjs.com/) | Framework Node.js escalável |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Prisma ORM](https://www.prisma.io/) | Acesso ao banco de dados |
| [SQLite](https://www.sqlite.org/) | Banco de dados local |
| [JWT](https://jwt.io/) | Autenticação stateless |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hash de senhas |
| [Multer](https://github.com/expressjs/multer) | Upload de arquivos |
| [Swagger](https://swagger.io/) | Documentação da API |
| [class-validator](https://github.com/typestack/class-validator) | Validação de DTOs |

---

## 📁 Estrutura do Projeto

```
src/
├── app/                        # Módulo raiz
├── auth/
│   ├── common/
│   │   └── authconstants.ts    # Constantes de autenticação
│   ├── config/
│   │   └── jwt.config.ts       # Configuração do JWT
│   ├── dto/
│   │   └── signin.dto.ts       # DTO de login
│   ├── guard/
│   │   └── auth-token.guard.ts # Guard JWT (valida e decodifica o token)
│   ├── hash/
│   │   ├── bcryptService.ts    # Implementação bcrypt
│   │   └── hashing.service.ts  # Protocolo de hash
│   ├── param/
│   │   └── token-playload.param.ts # Decorator para extrair payload do token
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── common/
│   ├── dto/
│   │   └── pagination.dto.ts   # DTO de paginação (limit, offset)
│   ├── filters/
│   │   └── exception-filter.ts # Filtro global de exceções
│   ├── guards/
│   │   └── admin.guard.ts      # Guard de admin
│   ├── interceptors/
│   │   ├── add-header.interceptor.ts
│   │   ├── body-create-task.interceptor.ts
│   │   └── logger.interceptor.ts
│   └── middlewares/
│       └── logger.middleware.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── response-task.dto.ts
│   │   └── update-task.dto.ts
│   ├── entities/
│   │   └── tasks.entities.ts
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   ├── tasks.service.ts
│   └── tasks.utils.ts
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── playload-token.dto.ts
│   │   ├── response-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
└── main.ts
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Luanbrx/Scalable-Nest-Rest-Api.git

# Entre na pasta
cd Scalable-Nest-Rest-Api

# Instale as dependências
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Banco de dados SQLite
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_TTL=86400
JWT_AUDIENCE=localhost
JWT_ISSUER=localhost

# Porta do servidor
PORT=3001
```

### Banco de Dados

```bash
# Gera o cliente Prisma
npx prisma generate

# Roda as migrations
npx prisma migrate dev

# (Opcional) Abre o Prisma Studio
npx prisma studio
```

### Executar em desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3001`

---

## 🗂️ Endpoints

### Auth
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth` | Login do usuário | ❌ |

### Users
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/users` | Cadastrar usuário | ❌ |
| GET | `/users/:id` | Buscar usuário por ID | ❌ |
| PATCH | `/users/:id` | Atualizar usuário | ✅ |
| DELETE | `/users/:id` | Deletar usuário | ✅ |
| POST | `/users/upload` | Atualizar foto do usuário | ✅ |

### Tasks
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/tasks` | Listar tarefas do usuário | ✅ |
| POST | `/tasks` | Criar tarefa | ✅ |
| GET | `/tasks/:id` | Buscar tarefa por ID | ❌ |
| PATCH | `/tasks/:id` | Atualizar tarefa | ✅ |
| DELETE | `/tasks/:id` | Excluir tarefa | ✅ |

---

## 🗄️ Schema do Banco de Dados

```prisma
model User {
  id           Int       @id @default(autoincrement())
  name         String
  passwordHast String
  email        String    @unique
  active       Boolean   @default(true)
  avatar       String?
  createdAt    DateTime? @default(now())
  updatedAt    DateTime? @updatedAt
  Task         Task[]
}

model Task {
  id          Int       @id @default(autoincrement())
  name        String
  description String
  completed   Boolean   @default(false)
  createdAt   DateTime? @default(now())
  updatedAt   DateTime? @updatedAt
  userId      Int?
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)**. Para acessar rotas protegidas:

1. Faça login em `POST /auth` com email e senha
2. Copie o `token` retornado na resposta
3. Envie o token no header de todas as requisições protegidas:

```
Authorization: Bearer <seu_token>
```

---

## 🔗 Repositório do Frontend

[Scalable-Next-Frontend](https://github.com/Luanbrx/Scalable-Next-Frontend)

---

## 📝 Licença

Este projeto está sob a licença MIT.
