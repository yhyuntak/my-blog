# 🛠️ 개발 환경 설정 가이드

## 📋 목차
- [필수 도구 설치](#필수-도구-설치)
- [프로젝트 초기화](#프로젝트-초기화)
- [데이터베이스 설정](#데이터베이스-설정)
- [개발 서버 실행](#개발-서버-실행)
- [문제 해결](#문제-해결)

---

## 필수 도구 설치

### 1. Node.js 설치

#### Ubuntu/Debian
```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 버전 확인
node --version  # v18.x.x 이상
npm --version
```

#### macOS
```bash
# Homebrew 사용
brew install node

# 또는 공식 사이트에서 다운로드
# https://nodejs.org
```

#### Windows
1. [Node.js 공식 사이트](https://nodejs.org)에서 LTS 버전 다운로드
2. 설치 프로그램 실행
3. 명령 프롬프트에서 확인: `node --version`

### 2. pnpm 설치

```bash
# npm으로 설치
npm install -g pnpm

# 또는 corepack 사용 (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate

# 버전 확인
pnpm --version
```

### 3. PostgreSQL 설치

#### Ubuntu/Debian
```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# 서비스 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 버전 확인
psql --version
```

#### macOS
```bash
# Homebrew 사용
brew install postgresql

# 서비스 시작
brew services start postgresql
```

#### Windows
1. [PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 다운로드
2. 설치 프로그램 실행
3. 설치 중 비밀번호 설정

### 4. Git 설치

#### Ubuntu/Debian
```bash
sudo apt install git
```

#### macOS
```bash
brew install git
```

#### Windows
1. [Git 공식 사이트](https://git-scm.com/download/win)에서 다운로드
2. 설치 프로그램 실행

---

## 프로젝트 초기화

### 1. Turborepo 프로젝트 생성

```bash
# 프로젝트 생성
pnpm create turbo@latest my-blog

# 프로젝트 디렉토리로 이동
cd my-blog

# 의존성 설치
pnpm install
```

### 2. 프로젝트 구조 확인

생성된 구조:
```
my-blog/
├── apps/
│   ├── web/          # React 앱
│   └── docs/         # 문서 앱 (삭제 가능)
├── packages/
│   ├── ui/           # 공통 UI 컴포넌트
│   ├── eslint-config/ # ESLint 설정
│   └── typescript-config/ # TypeScript 설정
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### 3. 불필요한 앱 제거

```bash
# docs 앱 제거 (우리는 별도로 docs 폴더 사용)
rm -rf apps/docs

# package.json에서 docs 앱 참조 제거
```

### 4. API 앱 추가

```bash
# apps 디렉토리에 api 폴더 생성
mkdir apps/api

# NestJS 프로젝트 초기화
cd apps/api
pnpm create nest-app . --package-manager pnpm
```

---

## 데이터베이스 설정

### 1. PostgreSQL 데이터베이스 생성

```bash
# PostgreSQL 접속
sudo -u postgres psql

# 데이터베이스 생성
CREATE DATABASE myblog;

# 사용자 생성
CREATE USER myuser WITH PASSWORD 'mypassword';

# 권한 부여
GRANT ALL PRIVILEGES ON DATABASE myblog TO myuser;

# 접속 확인
\c myblog

# 종료
\q
```

### 2. 환경 변수 설정

#### 루트 디렉토리에 .env 파일 생성

```bash
# .env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/myblog?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

#### apps/api/.env 파일 생성

```bash
# apps/api/.env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/myblog?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
```

### 3. Prisma 설정

```bash
# API 디렉토리에서 Prisma 설치
cd apps/api
pnpm add prisma @prisma/client
pnpm add -D prisma

# Prisma 초기화
npx prisma init

# 스키마 파일 생성 (prisma/schema.prisma)
```

#### prisma/schema.prisma 예시

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  posts     Post[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String    @id @default(cuid())
  title     String
  content   String?
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4. 마이그레이션 실행

```bash
# 마이그레이션 생성
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

---

## 개발 서버 실행

### 1. 전체 프로젝트 실행

```bash
# 루트 디렉토리에서
pnpm dev
```

### 2. 개별 앱 실행

```bash
# 프론트엔드만 실행
pnpm --filter web dev

# 백엔드만 실행
pnpm --filter api dev
```

### 3. 빌드

```bash
# 전체 빌드
pnpm build

# 개별 빌드
pnpm --filter web build
pnpm --filter api build
```

---

## 문제 해결

### 1. 포트 충돌

```bash
# 포트 사용 프로세스 확인
lsof -i :3000
lsof -i :4000
lsof -i :5432

# 프로세스 종료
kill -9 <PID>
```

### 2. 권한 문제

```bash
# pnpm 전역 설치 권한
sudo npm install -g pnpm

# 또는 npm prefix 변경
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 3. 캐시 문제

```bash
# pnpm 캐시 클리어
pnpm store prune

# node_modules 재설치
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### 4. 데이터베이스 연결 문제

```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql

# 서비스 재시작
sudo systemctl restart postgresql

# 연결 테스트
psql -h localhost -U myuser -d myblog
```

---

## ✅ 설정 완료 체크리스트

- [ ] Node.js 18.x 이상 설치
- [ ] pnpm 설치
- [ ] PostgreSQL 설치 및 실행
- [ ] Git 설치
- [ ] Turborepo 프로젝트 생성
- [ ] 데이터베이스 생성
- [ ] 환경 변수 설정
- [ ] Prisma 설정
- [ ] 마이그레이션 실행
- [ ] 개발 서버 실행 확인

---

## 📚 다음 단계

환경 설정이 완료되면 다음 단계로 진행하세요:

1. [TypeScript 학습 가이드](./typescript-guide.md)
2. [React 학습 가이드](./react-guide.md)
3. [NestJS 학습 가이드](./nestjs-guide.md)

---

**마지막 업데이트**: 2025-01-23  
**다음 업데이트 예정**: 새로운 도구 추가 시