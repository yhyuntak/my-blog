# Epic 4: 프론트엔드 기반

**목표**: 상태 관리, 레이아웃, 라우팅 구축
**예상 기간**: Week 4 (40시간)

## 스토리 목록

### Story 4.1: TanStack Query + Zustand 설정
- **파일**: `docs/backlog/stories/epic4-frontend-foundation/4.1-tanstack-zustand.md`
- **작업**: QueryClient 설정, Zustand stores

### Story 4.2: Header 컴포넌트
- **파일**: `docs/backlog/stories/epic4-frontend-foundation/4.2-header.md`
- **작업**: Sticky header, 로고, 로그인/로그아웃 버튼

### Story 4.3: Left Sidebar 컴포넌트
- **파일**: `docs/backlog/stories/epic4-frontend-foundation/4.3-sidebar.md`
- **작업**: 카테고리 트리, 반응형 (햄버거 메뉴)

### Story 4.4: React Router 설정
- **파일**: `docs/backlog/stories/epic4-frontend-foundation/4.4-routing.md`
- **작업**: Public/Protected routes

## 관련 문서

- `docs/frontend/layout.md`: Header, LSB 레이아웃 ⭐
- `docs/frontend/state-management.md`: TanStack Query + Zustand 구조
- `docs/frontend/components.md`: 컴포넌트 목록
- `CLAUDE.md`: 프론트엔드 아키텍처

## 중요 설계 포인트

- TanStack Query: 서버 데이터
- Zustand: 클라이언트 상태 (auth, modals, sidebar)
- Header: Sticky, 간단한 디자인
- LSB: Desktop 항상 표시, Mobile 햄버거
- 반응형: Mobile (≤768px), Tablet (769-1024px), Desktop (≥1025px)
