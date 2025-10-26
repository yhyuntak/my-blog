# 프론트엔드 문서

## 📅 작성 정보
- **작성일**: 2025-10-25
- **프레임워크**: React + Vite
- **상태 관리**: TanStack Query + Zustand
- **라우팅**: React Router
- **버전**: 1.0

---

## 📂 문서 구조

### 📐 레이아웃
- [layout.md](./layout.md) - 전체 레이아웃, Header, Sidebar, 검색 모달

### 📄 페이지
- [pages/home.md](./pages/home.md) - 홈 페이지
- [pages/post-list.md](./pages/post-list.md) - 글 목록 페이지
- [pages/post-detail.md](./pages/post-detail.md) - 글 상세 페이지
- [pages/login.md](./pages/login.md) - 로그인 페이지
- [pages/post-editor.md](./pages/post-editor.md) - 글 작성/수정 페이지
- [pages/category-manage.md](./pages/category-manage.md) - 카테고리 관리 페이지

### 🧩 기타
- [components.md](./components.md) - 주요 컴포넌트 목록
- [state-management.md](./state-management.md) - 라우팅, 상태 관리, 권한, 사용자 플로우

---

## 🎯 빠른 참조

### 주요 URL 패턴
| 페이지 | URL | 접근 권한 |
|--------|-----|----------|
| 홈 | `/` | 공개 |
| 글 목록 | `/posts?category=tech&page=1` | 공개 |
| 글 상세 | `/posts/:slug-:id` | 공개 |
| 로그인 | `/login` | 공개 |
| 글 작성 | `/posts/new` | 관리자 |
| 글 수정 | `/posts/:id/edit` | 관리자 |
| 카테고리 관리 | `/admin/categories` | 관리자 |

### 주요 컴포넌트

**Layout:**
- Header (Sticky)
- LeftSidebar (카테고리)
- RightSidebar (TOC, 관련 글)
- SearchModal

**Pages:**
- HomePage
- PostListPage
- PostDetailPage
- LoginPage
- PostEditorPage
- CategoryManagePage

---

## 🎨 디자인 특징

### 고정 헤더 (Sticky Header)
- 스크롤해도 상단에 고정
- 로고 + 검색 + 로그인/프로필

### 검색 모달
- 좌측: 카테고리 필터
- 우측: 실시간 검색 결과

### 3단 레이아웃 (글 상세만)
```
[LSB] [Content] [RSB]
```

### 반응형
- Mobile: 1단 (햄버거 메뉴)
- Tablet: 2단 (LSB + Content)
- Desktop: 3단 (LSB + Content + RSB)

---

## 📝 미결정 사항

- [ ] 썸네일 이미지 관리 방식
- [ ] Hero Section 상세 디자인
- [ ] Footer 내용
- [ ] 카테고리 드래그 앤 드롭 라이브러리

---

**최종 수정**: 2025-10-25
