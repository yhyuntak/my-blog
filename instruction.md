# 블로그 프로젝트 개발 가이드

## 🤖 AI 어시스턴트 역할 정의

**중요**: 이 프로젝트에서 AI 어시스턴트는 **점진적 확장(Progressive Enhancement)** 방식으로 코드를 작성합니다:

### 📝 코드 작성 방식

**점진적 확장 원칙:**
- ✅ **작은 단위로 시작**: 최소한의 동작하는 코드부터 작성
- ✅ **한 단계씩 확장**: 기능을 하나씩 추가하며 설명
- ✅ **이해 우선**: 각 단계마다 "왜 이렇게 하는지" 설명
- ✅ **테스트 가능**: 각 단계마다 실행하고 확인 가능하도록
- ✅ **점진적 개선**: 동작 → 개선 → 최적화 순서로 진행

**AI의 역할:**
- 🔨 **코드 직접 작성**: 파일 생성/수정을 직접 수행
- 📚 **학습 가이드**: 각 코드의 의미와 개념 설명
- 🔍 **문제 해결**: 에러 발생 시 디버깅 및 수정
- 💡 **설계 제안**: 아키텍처, 패턴, 최적화 방안 제시
- 📖 **문서 참조**: 필요시 공식 문서와 학습 자료 안내

**작업 흐름 예시:**
1. **Step 1**: 가장 기본적인 구조 작성 (뼈대)
2. **Step 2**: 핵심 기능 하나 추가 + 설명
3. **Step 3**: 추가 기능 확장 + 설명
4. **Step 4**: 에러 처리, 타입 안정성 개선
5. **Step 5**: 최적화 및 리팩토링

**사용자는 각 단계를 이해하며 학습하고, AI는 실행 가능한 코드를 점진적으로 작성합니다.**

---

## 📋 프로젝트 개요

### 🎯 목표
개인 블로그 웹사이트 개발 및 시놀로지 NAS에 배포

### 👤 대상
- 초보~주니어 개발자
- 회사에서 TypeScript/JavaScript를 쓰지만 기본기를 다지고 싶은 사람
- React, NestJS, TypeScript 학습 목적
- 실무 경험 쌓기

### 🏗️ 아키텍처
- **모노레포**: Turborepo + pnpm workspace
- **프론트엔드**: React + Vite
- **백엔드**: NestJS
- **데이터베이스**: PostgreSQL + Prisma
- **배포**: Docker + 시놀로지 NAS

---

## 🔧 기술 스택 선택 이유

### 왜 모노레포인가?
**Turborepo + pnpm workspace**
- ✅ **타입 공유**: 프론트/백 간 API 타입, DTO 공유로 타입 안정성 확보
- ✅ **코드 재사용**: 유효성 검사 스키마, 유틸 함수 등 공통 코드 사용
- ✅ **일관된 개발 환경**: ESLint, Prettier, TypeScript 설정 통일
- ✅ **효율적인 빌드**: 변경된 패키지만 빌드 (캐싱)
- ⚠️ **초기 설정 복잡도**: Turborepo 학습 필요 (배우는 재미!)

### 왜 NestJS인가?
**Express가 아닌 NestJS**
- ✅ **TypeScript 우선**: 처음부터 TypeScript로 설계됨
- ✅ **구조화된 아키텍처**: 모듈, 컨트롤러, 서비스 패턴 (유지보수 용이)
- ✅ **내장 기능**: 인증, 검증, ORM 연동 등 바로 사용 가능
- ✅ **확장성**: 프로젝트가 커져도 구조 유지 용이
- 🎓 **학습 곡선**: Express보다 높지만 실무 패턴 학습 가능

### 왜 Prisma인가?
**직접 SQL이 아닌 Prisma ORM**
- ✅ **타입 안정성**: 자동 생성되는 TypeScript 타입
- ✅ **직관적인 쿼리**: SQL 모르더라도 데이터 조작 가능
- ✅ **마이그레이션 관리**: 스키마 변경 이력 자동 관리
- ✅ **개발 속도**: Raw SQL보다 빠른 개발 가능
- 🎓 **SQL 학습**: 나중에 복잡한 쿼리는 Raw SQL도 배우기

### 왜 React + Vite인가?
**Create React App이 아닌 Vite**
- ✅ **빠른 개발 서버**: HMR(Hot Module Replacement) 속도 압도적
- ✅ **최신 도구**: Vite가 현재 표준으로 자리잡음
- ✅ **간단한 설정**: CRA보다 설정 파일 이해하기 쉬움

### 왜 TanStack Query + Zustand인가?
**상태를 성격별로 분리**
- **서버 상태** (게시글, 댓글, 사용자 정보) → TanStack Query
- **클라이언트 상태** (다크모드, 사이드바, 모달) → Zustand
- **로컬 상태** (폼 입력, 버튼 hover) → useState

**TanStack Query (서버 상태)**
- ✅ 캐싱, 리페칭, 중복 제거 등 **자동 처리**
- ✅ 로딩/에러 상태 자동 관리
- ✅ 낙관적 업데이트, 무효화 등 강력한 기능
- ✅ Redux로 하면 몇백 줄 코드 → React Query는 10줄
- 🎯 **서버 상태 관리의 사실상 표준**

**Zustand (클라이언트 글로벌 상태)**
- ✅ 매우 간단 (보일러플레이트 거의 없음)
- ✅ 5분이면 배움
- ✅ Redux처럼 강력하지만 훨씬 가벼움
- ✅ 요즘 신규 프로젝트 대세
- 🎯 **"Redux의 복잡함 없이 Redux의 장점만"**

**왜 Redux가 아닌가?**
- Redux는 서버 상태까지 관리하려면 **엄청난 보일러플레이트**
- 액션, 리듀서, 액션 크리에이터, Thunk... 배우는 데만 시간 소요
- TanStack Query + Zustand 조합이 **더 간단하고 현대적**
- Redux는 레거시 프로젝트나 매우 복잡한 상태 로직에만 필요
- 나중에 회사 코드 보면서 배워도 충분

---

## 🚀 개발 단계별 가이드

## Phase 1: 환경 설정 & 모노레포 구축

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
- Tailwind CSS 4.x (최신 버전)
- PostCSS + Autoprefixer

# 상태 관리
- @tanstack/react-query 5.59.0 (서버 상태 - 필수)
- zustand 5.0.0 (클라이언트 글로벌 상태)

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
│       ├── types/              # 공통 타입 (Post, User 등)
│       ├── validators/         # Zod 검증 스키마
│       └── package.json
│
├── package.json                # 루트 package.json
├── pnpm-workspace.yaml         # pnpm workspace 설정
├── turbo.json                  # Turborepo 설정
└── .gitignore
```

### 🎯 목표
- Turborepo + pnpm workspace 설정
- 프론트엔드(React), 백엔드(NestJS) 기본 구조 생성
- PostgreSQL + Prisma 연결
- 개발 환경 구성 (ESLint, Prettier)

### 📚 학습 목표
- 모노레포 개념과 작동 원리
- Turborepo 설정 파일 이해
- pnpm workspace 사용법
- 프로젝트 구조 설계

---

## Phase 2: MVP 핵심 기능 개발

### 🎯 핵심 기능

**1. 사용자 인증**
- 회원가입/로그인
- JWT 토큰 기반 인증
- 비밀번호 해싱

**2. 게시글 관리**
- CRUD 기능 (생성, 읽기, 수정, 삭제)
- 제목, 내용, 작성일, 수정일
- 작성자 정보

**3. 댓글 시스템**
- 게시글별 댓글 작성/삭제
- 댓글 작성자 정보

**4. 이미지 업로드**
- 로컬 파일 시스템에 저장
- Multer를 통한 파일 처리

### 📚 학습 목표
- React 컴포넌트 설계
- TanStack Query를 통한 서버 상태 관리
- Zustand로 클라이언트 상태 관리
- NestJS 모듈 구조 이해
- Prisma ORM 사용법
- JWT 인증 구현
- RESTful API 설계
- TypeScript 타입 정의 및 공유

---

## Phase 3: 배포 & 안정화

### 📦 추가 기술 스택
- **Docker**: 컨테이너화
- **Docker Compose**: 멀티 컨테이너 관리
- **Nginx**: 리버스 프록시
- **Let's Encrypt**: SSL 인증서

### 🎯 목표
- 시놀로지 NAS에 Docker로 배포
- 도메인 연결 및 SSL 설정
- 프로덕션 환경 최적화
- 에러 핸들링 및 로깅

### 📚 학습 목표
- Docker 컨테이너 개념
- Docker Compose 설정
- Nginx 리버스 프록시
- SSL 인증서 관리
- 환경 변수 관리 (dev/prod)

---

## Phase 4: 성능 최적화 & 고급 기능 (선택사항)

### 📦 추가 기술 스택 (선택사항)
- **Redis**: 캐싱
- **Sharp**: 이미지 최적화
- **Winston**: 로깅
- **Elasticsearch**: 검색 엔진 (고급)
- **WebSocket**: 실시간 기능 (고급)
- **Next.js**: SSR/SSG가 필요한 경우

### 🎯 가능한 확장 기능
- 캐싱을 통한 성능 향상
- 이미지 최적화 및 CDN
- 고급 검색 기능
- 카테고리/태그 시스템
- 좋아요/북마크 기능
- 마크다운 에디터
- 모니터링 시스템 구축

**참고**: Phase 4는 MVP 완성 후 필요에 따라 선택적으로 추가

---

## 🛠️ 개발 환경 설정

### 필수 도구 설치
1. **Node.js** (18.x 이상)
2. **pnpm** (패키지 매니저)
   ```bash
   npm install -g pnpm
   ```
3. **PostgreSQL** (데이터베이스)
4. **Docker** (배포용, Phase 3에서 필요)
5. **Git** (버전 관리)

### 개발 환경 구성
```bash
# 1. Turborepo 프로젝트 생성
npx create-turbo@latest my-blog

# 2. 프로젝트 디렉토리 이동
cd my-blog

# 3. 의존성 설치
pnpm install

# 4. 개발 서버 실행
pnpm dev
```

---

## 📖 학습 리소스

### 공식 문서 (이것만 보면 됨!)
- [Turborepo 공식 문서](https://turbo.build/repo/docs) - 모노레포 설정 막히면 여기
- [React 공식 문서](https://react.dev) - 컴포넌트, Hooks 개념
- [NestJS 문서](https://docs.nestjs.com) - 모듈, 컨트롤러, 서비스 패턴
- [Prisma 문서](https://www.prisma.io/docs) - 스키마 정의, 마이그레이션
- [Tailwind CSS 문서](https://tailwindcss.com/docs) - 스타일링 클래스 찾기
- [TanStack Query 문서](https://tanstack.com/query/latest) - 서버 상태 관리
- [Zustand 문서](https://github.com/pmndrs/zustand) - 클라이언트 상태 관리

### 에러 발생 시 참고
- **Turborepo 빌드 에러**: [Troubleshooting](https://turbo.build/repo/docs/troubleshooting)
- **Prisma 마이그레이션 에러**: [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model)
- **NestJS 인증 에러**: [Authentication](https://docs.nestjs.com/security/authentication)
- **CORS 에러**: [NestJS CORS](https://docs.nestjs.com/security/cors)

### 추천 학습 순서 (선택사항)
1. **TypeScript 기초 다지기**: 타입, 인터페이스, 제네릭
2. **React Hooks 이해하기**: useState, useEffect, custom hooks
3. **NestJS 튜토리얼 따라하기**: 공식 문서 Overview 섹션
4. **Prisma Quickstart**: 간단한 CRUD 만들어보기

---

## ❓ 자주 묻는 질문

### Q: AI가 코드를 직접 작성해주나요?
A: 네, **점진적 확장 방식**으로 작성합니다. 작은 단위로 시작해서 한 단계씩 기능을 추가하며, 각 단계마다 코드의 의미와 작동 원리를 설명합니다. 사용자는 각 단계를 이해하며 학습할 수 있습니다.

### Q: 어디서부터 시작해야 하나요?
A: Phase 1(환경 설정)부터 시작하세요. Turborepo 프로젝트를 만들고 기본 구조를 잡는 것이 첫 단계입니다.

### Q: 모노레포가 너무 어려운데요?
A: 초반에는 복잡할 수 있습니다. 막히면 AI에게 질문하세요. "왜 이렇게 설정하나요?"를 이해하는 것이 중요합니다.

### Q: 에러가 발생하면 어떻게 하나요?
A:
1. 에러 메시지를 천천히 읽어보세요
2. 스택 트레이스에서 어느 파일/줄인지 확인
3. 위 "에러 발생 시 참고" 링크 확인
4. AI에게 에러 메시지와 코드를 보여주며 질문

### Q: 타입 공유는 어떻게 하나요?
A: `packages/shared`에 공통 타입을 정의하고, 프론트/백에서 import해서 사용합니다. 예:
```typescript
// packages/shared/types/post.ts
export interface Post {
  id: number;
  title: string;
  content: string;
}

// apps/web/src/pages/PostList.tsx
import { Post } from '@my-blog/shared';

// apps/api/src/posts/posts.service.ts
import { Post } from '@my-blog/shared';
```

### Q: 회사에서는 Redux 쓰는데 다른 걸 배워도 되나요?
A: 오히려 좋습니다!
- TanStack Query + Zustand를 먼저 배우면 **상태 관리의 본질**을 이해
- 나중에 Redux 보면 "아, 이래서 요즘은 이렇게 안 하는구나" 이해됨
- Redux 알면 Zustand는 5분이면 배움 (반대도 마찬가지)
- 양쪽 다 알면 **왜 이렇게 발전했는지** 맥락 이해

### Q: Zustand는 언제 쓰나요?
A: 여러 컴포넌트가 공유해야 하는 클라이언트 상태에만 사용하세요.
- ✅ 다크모드/라이트모드 설정
- ✅ 사이드바/모달 열림/닫힘
- ✅ 사용자 설정
- ❌ API에서 가져온 데이터 (이건 TanStack Query)
- ❌ 폼 입력값 (이건 useState)

### Q: 완성까지 얼마나 걸리나요?
A: 개인마다 다릅니다. 중요한 건 시간이 아니라 "작동하는 블로그를 만들고 그 과정에서 배우는 것"입니다.

---

## 🎯 성공을 위한 팁

### 개발 원칙
1. **작동하는 것부터** - 완벽한 코드는 나중에
2. **작은 단위로 개발** - 한 번에 하나씩
3. **자주 커밋** - Git을 적극 활용하고 커밋 메시지 잘 쓰기
4. **문서 읽기** - 공식 문서가 최고의 자료
5. **막히면 질문** - 혼자 고민하지 말고 AI에게 물어보기

### 효과적인 학습 방법
- **왜?를 이해하기**: "이 코드가 왜 필요한가?"
- **작은 실험**: 코드 바꿔보고 어떻게 작동하는지 확인
- **에러 두려워하지 않기**: 에러는 배움의 기회
- **꾸준함**: 하루 1-2시간이라도 매일 하는 게 중요

### 주의사항
- ❌ 처음부터 모든 기능 넣지 말기
- ❌ 완벽주의 버리기 (리팩토링은 나중에)
- ❌ 혼자 며칠씩 고민하지 말고 질문하기
- ✅ 작동하는 블로그가 목표!
- ✅ 배우면서 만들고, 만들면서 배우기

### 막힐 때 체크리스트
1. 에러 메시지를 정확히 읽었는가?
2. 공식 문서를 확인했는가?
3. 최근에 뭘 바꿨는가? (Git diff 확인)
4. 비슷한 에러를 구글에서 검색했는가?
5. AI에게 구체적으로 질문했는가?

---

**작성일**: 2025-01-23
**최종 수정**: 2025-10-24
**버전**: 2.0
**대상**: 초보~주니어 개발자
**목표**: 시놀로지 NAS 배포 블로그 개발 & TypeScript 풀스택 학습