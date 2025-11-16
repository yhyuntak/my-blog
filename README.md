# 히포's Tech Blog

개인 기술 블로그 프로젝트 - 학습과 포트폴리오 구축을 위한 풀스택 웹 애플리케이션

## Tech Stack

- **Monorepo**: Turborepo + pnpm
- **Frontend**: React + Vite
- **Backend**: NestJS
- **Database**: PostgreSQL + Prisma
- **Editor**: Tiptap (Notion-style)

## Project Structure

```
my-blog/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React + Vite frontend
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── typescript-config/  # Shared TypeScript configs
└── docs/             # Design documents
```

## Development Setup

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- PostgreSQL (installed locally)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-blog
```

2. Install dependencies:
```bash
pnpm install
```

3. Create PostgreSQL database:
```bash
createdb my_blog
```

4. Configure environment variables:
```bash
cd apps/api
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL credentials
```

Example DATABASE_URL:
```
# Without password (local PostgreSQL)
DATABASE_URL=postgresql://your_username@localhost:5432/my_blog?schema=public

# With password
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/my_blog?schema=public
```

5. Verify Prisma connection:
```bash
cd apps/api
npx prisma validate
```

### Running the Application

```bash
# Run both frontend and backend
pnpm dev

# Run backend only
pnpm dev:api

# Run frontend only
pnpm dev:web
```

### Available Scripts

#### Root Scripts
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Type check all apps

#### Database Scripts
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:push` - Push schema changes to database

### Ports

- Frontend: http://localhost:50173
- Backend: http://localhost:60000

## Documentation

Detailed design documents are available in the [docs/](./docs) directory:

- [Database Schema](./docs/database/schema.md)
- [Frontend Architecture](./docs/frontend/README.md)
- [Phase 1 Decisions](./docs/decisions/phase1-decisions.md)

## License

Private project for personal use.
