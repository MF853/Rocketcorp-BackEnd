# Projeto Rocket Corp

Este repositório marca o início do nosso projeto para o desafio Rocket Corp, parte do Rocket Lab. Nosso grupo está animado para desenvolver as soluções propostas e colaborar ao máximo para o sucesso do projeto.

## Participantes

Nosso time é formado pelos seguintes integrantes:

- [Alice Cadete](https://github.com/alicecadete28)
- [Arthur Lins](https://github.com/ArthurLins00)
- [Erico Chen](https://github.com/erico-chen)
- [Luan Bezerra](https://github.com/luanbezerra)
- [José Mário](https://github.com/MF853)
- [Raylandson Cesário](https://github.com/Raylandson)

## 📖 Resumo do Projeto

Este projeto consiste em um backend robusto desenvolvido com NestJS, utilizando PostgreSQL como banco de dados, Prisma como ORM, e Docker para a containerização do ambiente. A autenticação é gerenciada com JWT, incluindo um sistema de controle de acesso baseado em roles (Role-Based Access Control). O projeto está configurado com scripts para facilitar o desenvolvimento, deploy em produção e seeding do banco de dados.

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js para aplicações escaláveis
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno para TypeScript/JavaScript
- **Docker** - Containerização da aplicação
- **pnpm** - Gerenciador de pacotes rápido e eficiente

## 🚀 Como executar o projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/Raylandson/Rocketcorp-BackEnd.git
cd Rocketcorp-BackEnd
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

O arquivo `.env` já está configurado com as seguintes variáveis:

```env
DATABASE_URL="postgresql://rocketcorp_user:rocketcorp_password@localhost:5432/rocketcorp_db?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET="your_super_secret_key"
GEMINI_API_KEY="your-gemini-api-key"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rocketcorp_db
DB_USER=rocketcorp_user
DB_PASSWORD=rocketcorp_password
```

> **⚠️ Importante**: Para usar o sistema de geração de resumos com IA, você precisa configurar uma chave da API do Google Gemini na variável `GEMINI_API_KEY`. Obtenha sua chave em [Google AI Studio](https://makersuite.google.com/app/apikey).

### 4. Inicie o banco de dados com Docker

```bash
# Iniciar PostgreSQL e pgAdmin
pnpm docker:up

# Verificar se os containers estão rodando
docker ps
```

### 5. Configure o banco de dados

```bash
# Gerar o cliente Prisma
pnpm db:generate

# Executar as migrações
pnpm db:migrate

# Popular o banco de dados com dados de exemplo
npx tsx prisma/seed.ts

# (Opcional) Abrir Prisma Studio para visualizar os dados
pnpm db:studio
```

### 6. Inicie a aplicação

```bash
# Desenvolvimento (com hot reload)
pnpm start:dev

# Produção
pnpm build
pnpm start:prod
```

## 🎯 Setup completo em um comando

Para configurar tudo de uma vez:

```bash
pnpm dev:setup
```

Este comando irá:

1. Iniciar o Docker com PostgreSQL
2. Aguardar 5 segundos para o banco inicializar
3. Executar as migrações do Prisma
4. Gerar o cliente Prisma

## 📋 Scripts disponíveis

### Aplicação

```bash
pnpm start          # Iniciar aplicação
pnpm start:dev      # Iniciar em modo desenvolvimento
pnpm start:debug    # Iniciar em modo debug
pnpm start:prod     # Iniciar em modo produção
pnpm build          # Compilar aplicação
```

### Docker

```bash
pnpm docker:up      # Iniciar containers
pnpm docker:down    # Parar containers
pnpm docker:logs    # Ver logs do PostgreSQL
```

### Banco de dados

```bash
pnpm db:generate    # Gerar cliente Prisma
pnpm db:migrate     # Executar migrações
pnpm db:studio      # Abrir Prisma Studio
pnpm db:reset       # Resetar banco de dados
pnpm db:deploy      # Deploy das migrações (produção)
npx tsx prisma/seed.ts # Popular banco de dados com dados de exemplo
```

### Desenvolvimento

```bash
pnpm dev:setup      # Setup completo do ambiente
pnpm format         # Formatar código
pnpm lint           # Verificar código
pnpm test           # Executar testes
pnpm test:watch     # Executar testes em modo watch
pnpm test:cov       # Executar testes com cobertura
pnpm test:e2e       # Executar testes e2e
```

## 🐳 Serviços Docker

### PostgreSQL

- **Porta**: 5432
- **Usuário**: rocketcorp_user
- **Senha**: rocketcorp_password
- **Database**: rocketcorp_db

### pgAdmin (Interface web para PostgreSQL)

- **URL**: http://localhost:5050
- **Email**: admin@rocketcorp.com
- **Senha**: admin123

Para conectar ao banco no pgAdmin:

- **Host**: postgres (ou localhost)
- **Porta**: 5432
- **Usuário**: rocketcorp_user
- **Senha**: rocketcorp_password

## 🔗 Endpoints da API

Após iniciar a aplicação, a API estará disponível em:

- **Local**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (quando executar `pnpm db:studio`)

## 📁 Estrutura do projeto

```
src/
├── app.controller.ts    # Controller principal
├── app.module.ts        # Módulo principal
├── app.service.ts       # Service principal
├── main.ts             # Arquivo de inicialização
└── prisma/             # Configurações do Prisma
    ├── prisma.service.ts
    └── prisma.module.ts

prisma/
├── schema.prisma       # Schema do banco de dados
└── migrations/         # Migrações do banco

docker-compose.yml      # Configuração do Docker
```

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Comandos úteis

```bash
# Conectar diretamente ao PostgreSQL via Docker
docker exec -it rocketcorp-postgres psql -U rocketcorp_user -d rocketcorp_db

# Ver logs específicos do container
docker logs rocketcorp-postgres

# Parar todos os containers e remover volumes
docker-compose down -v

# Verificar status dos containers
docker ps -a
```

---

Vamos juntos nessa jornada! 🚀
