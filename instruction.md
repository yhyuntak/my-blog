# 블로그 프로젝트 개발 가이드

## 🤖 AI 어시스턴트 역할 정의

**중요**: 이 프로젝트에서 AI 어시스턴트는 **코드를 직접 작성하거나 파일을 수정하지 않습니다**. 대신 다음과 같은 역할을 수행합니다:

- 📚 **학습 가이드 제공**: 기술 스택과 개념에 대한 설명
- 🔍 **문제 해결 지원**: 에러 해결 방법과 디버깅 도움
- 💡 **아이디어 제안**: 구현 방법과 최적화 방안 제안
- 📖 **문서 안내**: 공식 문서와 학습 자료 추천
- ❓ **질문 답변**: 개발 과정에서 생기는 모든 질문에 대한 답변

**사용자는 직접 코드를 작성하고, AI는 그 과정을 도와주는 역할입니다.**

---

## 📋 프로젝트 개요

### 🎯 목표
개인 블로그 웹사이트 개발 및 시놀로지 NAS에 배포

### 👤 대상
- 초보 개발자
- React, NestJS, TypeScript 학습 목적
- 실무 경험 쌓기

### 🏗️ 아키텍처
- **모노레포**: Turborepo + pnpm
- **프론트엔드**: React → Next.js (Phase 3에서 전환)
- **백엔드**: NestJS
- **데이터베이스**: PostgreSQL + Prisma
- **배포**: Docker + 시놀로지 NAS

---

## 🚀 개발 단계별 가이드

## Phase 1: MVP 개발 (8주)

### 📦 필수 기술 스택

#### 공통
- **패키지 매니저**: pnpm
- **모노레포**: Turborepo
- **언어**: TypeScript
- **개발 도구**: ESLint + Prettier

#### 프론트엔드 (apps/web)
```bash
# 핵심
- React 18.3.1
- Vite (빌드 도구)
- TypeScript 5.6.3

# 라우팅
- react-router-dom 6.27.0

# 스타일링
- Tailwind CSS 3.4.14
- PostCSS + Autoprefixer

# 상태 관리
- @tanstack/react-query 5.59.0 (서버 상태)
- zustand 5.0.0 (글로벌 상태, 선택사항)

# 폼 관리
- react-hook-form 7.53.0
- zod 3.23.8 (검증)

# UI/UX
- lucide-react 0.454.0 (아이콘)
- date-fns 4.1.0 (날짜 처리)
```

#### 백엔드 (apps/api)
```bash
# 핵심
- NestJS 10.4.4
- TypeScript 5.6.3

# 데이터베이스
- Prisma 5.22.0
- PostgreSQL

# 인증
- @nestjs/jwt 10.2.0
- @nestjs/passport 10.0.3
- passport-jwt 4.0.1
- bcrypt 5.1.1

# 파일 업로드
- multer 1.4.5

# 환경 관리
- @nestjs/config 3.2.3
```

### 🗂️ 프로젝트 구조
```
my-blog/
├── apps/
│   ├── web/                    # React + Vite
│   │   ├── src/
│   │   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   │   ├── pages/          # 페이지 컴포넌트
│   │   │   ├── hooks/          # 커스텀 훅
│   │   │   ├── api/            # API 호출 함수
│   │   │   ├── types/          # TypeScript 타입
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # NestJS
│       ├── src/
│       │   ├── auth/           # 인증 모듈
│       │   ├── posts/          # 게시글 모듈
│       │   ├── comments/       # 댓글 모듈
│       │   ├── users/          # 사용자 모듈
│       │   ├── common/         # 공통 유틸
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── packages/
│   └── shared/                 # 공통 코드
│       ├── types/              # 공통 타입
│       ├── validators/         # 공통 검증 스키마
│       └── package.json
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── .gitignore
```

### 🎯 Phase 1 핵심 기능
1. **사용자 인증**
   - 회원가입/로그인
   - JWT 토큰 기반 인증
   - 비밀번호 해싱

2. **게시글 관리**
   - CRUD 기능 (생성, 읽기, 수정, 삭제)
   - 제목, 내용, 작성일, 수정일
   - 작성자 정보

3. **댓글 시스템**
   - 게시글별 댓글 작성/삭제
   - 댓글 작성자 정보

4. **이미지 업로드**
   - 로컬 파일 시스템에 저장
   - Multer를 통한 파일 처리

### 📚 Phase 1 학습 목표
- React 컴포넌트 설계
- React Query를 통한 서버 상태 관리
- NestJS 모듈 구조 이해
- Prisma ORM 사용법
- JWT 인증 구현
- TypeScript 타입 정의

---

## Phase 2: 배포 & 안정화 (2주)

### 📦 추가 기술 스택
- **Docker**: 컨테이너화
- **Docker Compose**: 멀티 컨테이너 관리
- **Nginx**: 리버스 프록시
- **Let's Encrypt**: SSL 인증서

### 🎯 Phase 2 목표
- 시놀로지 NAS에 Docker로 배포
- 도메인 연결 및 SSL 설정
- 프로덕션 환경 최적화

### 📚 Phase 2 학습 목표
- Docker 컨테이너 개념
- Docker Compose 설정
- Nginx 리버스 프록시
- SSL 인증서 관리

---

## Phase 3: Next.js 전환 (2-3주)

### 📦 기술 스택 변경
```bash
# 제거
- Vite
- react-router-dom

# 추가
- Next.js 15.0.2
- App Router
- SSR/SSG 기능
```

### 🎯 Phase 3 목표
- React → Next.js 마이그레이션
- SSR/SSG 적용으로 SEO 개선
- 성능 최적화

### 📚 Phase 3 학습 목표
- Next.js App Router
- SSR vs SSG 개념
- Next.js 최적화 기능

---

## Phase 4: 성능 최적화

### 📦 추가 기술 스택
- **Redis**: 캐싱
- **Sharp**: 이미지 최적화
- **Winston**: 로깅

### 🎯 Phase 4 목표
- 캐싱을 통한 성능 향상
- 이미지 최적화
- 모니터링 시스템 구축

---

## Phase 5: 고급 기능

### 📦 추가 기술 스택
- **Elasticsearch**: 검색 엔진
- **WebSocket**: 실시간 기능
- **Markdown Editor**: 고급 에디터
- **Google Analytics**: 분석 도구

### 🎯 Phase 5 목표
- 고급 검색 기능
- 실시간 알림
- 마크다운 에디터
- 사용자 분석

---

## 🛠️ 개발 환경 설정

### 필수 도구 설치
1. **Node.js** (18.x 이상)
2. **pnpm** (패키지 매니저)
3. **PostgreSQL** (데이터베이스)
4. **Docker** (배포용)
5. **Git** (버전 관리)

### 개발 환경 구성
```bash
# 1. 프로젝트 초기화
pnpm create turbo@latest my-blog

# 2. 워크스페이스 설정
cd my-blog
pnpm install

# 3. 개발 서버 실행
pnpm dev
```

---

## 📖 학습 리소스

### 공식 문서
- [React 공식 문서](https://react.dev)
- [Next.js 문서](https://nextjs.org/docs)
- [NestJS 문서](https://docs.nestjs.com)
- [Prisma 문서](https://www.prisma.io/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 추천 학습 순서
1. **TypeScript 기초** (1주)
2. **React 기초** (2주)
3. **NestJS 기초** (2주)
4. **Prisma + PostgreSQL** (1주)
5. **프로젝트 구현** (2주)

---

## ❓ 자주 묻는 질문

### Q: AI가 코드를 직접 작성해주나요?
A: 아니요. AI는 학습 가이드와 문제 해결 방법을 제공하며, 실제 코드는 사용자가 직접 작성합니다.

### Q: 어디서부터 시작해야 하나요?
A: Phase 1의 React 기초 학습부터 시작하세요. TypeScript를 먼저 배우는 것을 권장합니다.

### Q: 에러가 발생하면 어떻게 하나요?
A: 에러 메시지를 AI에게 보여주시면 해결 방법을 안내해드립니다.

### Q: 완성까지 얼마나 걸리나요?
A: Phase 1 (MVP)는 8주, 전체 프로젝트는 15-20주 정도 예상됩니다.

---

## 🎯 성공을 위한 팁

### 개발 원칙
1. **작동하는 것부터** - 완벽한 코드는 나중에
2. **작은 단위로 개발** - 한 번에 하나씩
3. **자주 커밋** - Git을 적극 활용
4. **문서 읽기** - 공식 문서가 최고의 자료

### 시간 관리
- **하루 2-3시간** 꾸준히 학습
- **주말 집중** 개발 시간 확보
- **단계별 목표** 설정

### 주의사항
- ❌ 처음부터 모든 기능 넣지 말기
- ❌ 완벽주의 버리기
- ❌ 혼자 고민하지 말고 질문하기
- ✅ 작동하는 블로그가 목표!

---

**작성일**: 2025-01-23  
**버전**: 1.0  
**대상**: 초보 개발자  
**목표**: 시놀로지 NAS 배포 블로그 개발