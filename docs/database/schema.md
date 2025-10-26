# 데이터베이스 스키마 설계

## 📅 작성 정보
- **작성일**: 2025-10-25
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma
- **버전**: 1.0

---

## 🗂️ 테이블 개요

| 테이블 | 설명 | 관계 |
|--------|------|------|
| **User** | 사용자 정보 (관리자 + 댓글 작성자) | Post의 작성자 |
| **Post** | 블로그 글 | User, Category와 연결 |
| **Category** | 카테고리 (계층 구조) | Post와 연결, 자기 참조 |

---

## 📋 테이블 상세 설계

### 1. User (사용자)

사용자 정보를 저장합니다. ID/PW 로그인과 GitHub OAuth 로그인을 모두 지원합니다.

#### 필드

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| `id` | String (CUID) | PK | 고유 ID |
| `username` | String? | Unique | ID/PW 로그인용 아이디 |
| `password` | String? | - | 해시된 비밀번호 (bcrypt) |
| `githubId` | String? | Unique | GitHub OAuth 사용자 ID |
| `githubUsername` | String? | - | GitHub 사용자명 |
| `name` | String | - | 표시되는 이름/닉네임 |
| `email` | String? | - | 이메일 (선택사항) |
| `avatar` | String? | - | 프로필 이미지 URL |
| `role` | Enum | Default: 'user' | 권한 ('admin' \| 'user') |
| `createdAt` | DateTime | - | 생성일시 |
| `updatedAt` | DateTime | - | 수정일시 |

#### 관계
- `posts` → Post[] (1:N)

#### 로그인 방식
- **ID/PW**: `username` + `password`로 인증
- **GitHub OAuth**: `githubId`로 인증, `githubUsername`과 `avatar` 자동 저장

#### 비고
- `username`, `password`는 ID/PW 로그인 시에만 존재
- `githubId`, `githubUsername`은 OAuth 로그인 시에만 존재
- `role` 기본값은 'user', 관리자는 Seed 스크립트로 생성

---

### 2. Post (글)

블로그 글 정보를 저장합니다.

#### 필드

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| `id` | String (CUID) | PK | 고유 ID |
| `title` | String | - | 글 제목 |
| `slug` | String | - | URL용 slug (한글 허용) |
| `content` | String (Text) | - | 글 내용 (Tiptap JSON 형식) |
| `excerpt` | String? | - | 글 요약 (LLM 생성, 수동) |
| `isPublic` | Boolean | Default: false | 공개/비공개 |
| `authorId` | String | FK | 작성자 (User.id) |
| `categoryId` | String | FK | 카테고리 (Category.id) |
| `createdAt` | DateTime | - | 생성일시 |
| `updatedAt` | DateTime | - | 수정일시 |

#### 관계
- `author` → User (N:1)
- `category` → Category (N:1)

#### URL 구조
```
형식: /posts/{slug}-{id}
예시: /posts/리액트-훅스-가이드-ckl3q4n5z0000qzrmn9o9k8q4
```
- `slug`: SEO 최적화 (한글 가능)
- `id`: 실제 조회용 (CUID)
- slug가 변경되어도 id로 조회하므로 이전 URL도 작동

#### 비고
- `content`는 Tiptap JSON 형태로 저장
- `excerpt`는 "요약 생성" 버튼 클릭 시 LLM API로 생성 (수동)
- `isPublic`이 false면 관리자만 조회 가능
- 삭제 시 물리적 삭제 (복구 불가)

---

### 3. Category (카테고리)

카테고리를 계층 구조로 관리합니다. Root/Trash 시스템 카테고리를 포함합니다.

#### 필드

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| `id` | String (CUID) | PK | 고유 ID |
| `name` | String | - | 카테고리 이름 (예: "기술", "일상") |
| `slug` | String | - | URL용 slug (예: "tech", "life") |
| `order` | Int | Default: 0 | 표시 순서 (정렬용) |
| `parentId` | String? | FK | 부모 카테고리 ID (자기 참조) |
| `depth` | Int | Default: 0 | 계층 깊이 (0, 1, 2) |
| `isSystem` | Boolean | Default: false | 시스템 카테고리 여부 |
| `createdAt` | DateTime | - | 생성일시 |
| `updatedAt` | DateTime | - | 수정일시 |

#### 관계
- `parent` → Category (N:1, 자기 참조)
- `children` → Category[] (1:N, 자기 참조)
- `posts` → Post[] (1:N)

#### 계층 구조

```
Root (depth: 0, isSystem: true)
  ├─ 기술 (depth: 1)
  │   ├─ React (depth: 2)
  │   └─ NestJS (depth: 2)
  ├─ 일상 (depth: 1)
  └─ 프로젝트 (depth: 1)

Trash (depth: 0, isSystem: true)
  └─ 삭제된 카테고리들 (depth: 1)
```

#### 삭제/복구 메커니즘

- **삭제**: Root → Trash로 이동 (`parentId` 변경)
- **복구**: Trash → Root로 이동 (`parentId` 변경)
- **외부 공개**: Root 하위만 공개, Trash는 관리자만 접근
- `deletedAt` 필드 없이 `parentId`로 관리

#### 제약사항

- **최대 3단계**: Root/Trash(0) → 카테고리(1) → 서브카테고리(2)
- **depth 검증**: 카테고리 생성/이동 시 `parent.depth >= 2`이면 에러
- **시스템 카테고리**: `isSystem: true`인 Root/Trash는 수정/삭제 불가

#### Seed 데이터

초기 시스템 카테고리:
```
Root: { id: 'root', name: 'Root', slug: 'root', depth: 0, isSystem: true }
Trash: { id: 'trash', name: 'Trash', slug: 'trash', depth: 0, isSystem: true }
```

초기 일반 카테고리:
```
기술: { name: '기술', slug: 'tech', parentId: 'root', depth: 1 }
일상: { name: '일상', slug: 'life', parentId: 'root', depth: 1 }
프로젝트: { name: '프로젝트', slug: 'project', parentId: 'root', depth: 1 }
```

---

## 🔗 관계 다이어그램

```
User (1) ──────< (N) Post
                     │
                     │
Category (1) ────< (N)

Category (Self-Referencing)
   ↓ parent
Category
   ↓ children
Category[]
```

---

## 📊 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ username*       │
│ password*       │
│ githubId*       │
│ githubUsername* │
│ name            │
│ email*          │
│ avatar*         │
│ role            │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N (author)
         │
         ▼
┌─────────────────┐
│      Post       │
├─────────────────┤
│ id (PK)         │
│ title           │
│ slug            │
│ content         │
│ excerpt*        │
│ isPublic        │
│ authorId (FK)   │◄─────┐
│ categoryId (FK) │      │
│ createdAt       │      │
│ updatedAt       │      │
└────────┬────────┘      │
         │               │
         │ N:1           │
         │               │
         ▼               │
┌─────────────────┐      │
│    Category     │      │
├─────────────────┤      │
│ id (PK)         │──────┘ 1:N
│ name            │
│ slug            │
│ order           │
│ parentId (FK)*  │◄─┐
│ depth           │  │ Self-Referencing
│ isSystem        │  │
│ createdAt       │  │
│ updatedAt       │  │
└─────────────────┘──┘
```

`*` = nullable 필드

---

## 🔍 주요 쿼리 패턴

### User 관련

```typescript
// ID/PW 로그인
findUnique({ where: { username } })

// GitHub OAuth 로그인
findUnique({ where: { githubId } })

// 사용자 정보 + 작성 글
findUnique({
  where: { id },
  include: { posts: true }
})
```

### Post 관련

```typescript
// 공개 글 목록 (페이지네이션)
findMany({
  where: {
    isPublic: true,
    categoryId: 'xxx'
  },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10
})

// 글 상세 (slug + id로 조회)
findUnique({
  where: { id },
  include: {
    author: true,
    category: true
  }
})

// 작성자의 모든 글
findMany({
  where: { authorId: 'xxx' }
})
```

### Category 관련

```typescript
// Root 하위 카테고리 (공개용)
findMany({
  where: { parentId: 'root' },
  orderBy: { order: 'asc' }
})

// Trash 하위 카테고리 (관리자용)
findMany({
  where: { parentId: 'trash' }
})

// 특정 depth 카테고리
findMany({
  where: { depth: 1 }
})

// 카테고리 + 하위 카테고리 + 글
findUnique({
  where: { id },
  include: {
    children: true,
    posts: { where: { isPublic: true } }
  }
})
```

---

## 🔐 제약 조건 (Constraints)

### Unique 제약
- `User.username` - 로그인 ID 중복 방지
- `User.githubId` - GitHub OAuth 중복 방지

### Foreign Key 제약
- `Post.authorId` → `User.id` (onDelete: Restrict)
- `Post.categoryId` → `Category.id` (onDelete: Restrict)
- `Category.parentId` → `Category.id` (onDelete: Restrict)

### Check 제약 (애플리케이션 레벨)
- `Category.depth` ≤ 2 (최대 3단계)
- `Category.isSystem = true`인 경우 수정/삭제 불가
- `User.role` ∈ {'admin', 'user'}

---

## 📈 인덱스 전략

### 현재
- 기본 PK 인덱스만 사용
- Unique 제약에 의한 자동 인덱스

### 향후 추가 고려 (성능 이슈 발생 시)

```typescript
// User
@@index([email])

// Post
@@index([categoryId, isPublic, createdAt])  // 글 목록 조회
@@index([authorId])                         // 작성자별 글
@@index([slug])                             // slug 검색

// Category
@@index([parentId, order])                  // 계층 조회 + 정렬
@@index([depth])                            // depth별 조회
```

---

## 🔄 마이그레이션 전략

### Phase 1 (초기)
- User, Post, Category 테이블 생성
- 기본 제약 조건 설정
- Seed 데이터 (Root, Trash, 기본 카테고리, 관리자 계정)

### Phase 2 (댓글 기능)
- Comment 테이블 추가 예정

### Phase 4 (고급 기능)
- Tag 테이블 추가 고려
- 조회수, 좋아요 등 통계 필드 추가

---

## 📝 특이사항 및 주의점

### 1. Soft Delete 미사용
- `deletedAt` 필드 없음
- Category는 Trash로 이동하여 관리
- Post는 물리적 삭제 (복구 불가)

### 2. 한글 slug 지원
- Post와 Category 모두 한글 slug 허용
- URL 인코딩 고려 필요

### 3. Content 저장 형식
- Tiptap JSON 형태로 저장
- 텍스트 필드 타입 사용 (긴 내용 대비)

### 4. Role 기반 권한
- `admin`: 모든 글 CRUD, 카테고리 관리
- `user`: 댓글 작성만 (Phase 2)

### 5. Category 계층 제한
- 최대 3단계로 제한
- 애플리케이션 레벨에서 검증 필요
- `depth` 필드로 쉽게 검증 가능

---

**최종 수정**: 2025-10-25
**다음 작업**: API 엔드포인트 설계
