# Epic 3: 백엔드 API 개발

**목표**: Category 및 Post CRUD API 구현
**예상 기간**: Week 3 (32시간)

## 스토리 목록

### Story 3.1: Category 조회 API
- **파일**: `docs/backlog/stories/epic3-backend-apis/3.1-category-api.md`
- **작업**: 카테고리 트리 구조 조회 API

### Story 3.2: Post 조회 API
- **파일**: `docs/backlog/stories/epic3-backend-apis/3.2-post-read-api.md`
- **작업**: 글 목록 (pagination, category 필터), 글 상세

### Story 3.3: Post 생성/수정/삭제 API
- **파일**: `docs/backlog/stories/epic3-backend-apis/3.3-post-write-api.md`
- **작업**: 글 작성, 수정, 삭제 (admin only)

## 관련 문서

- `docs/database/schema.md`: Post, Category 모델 구조
- `docs/decisions/phase1-decisions.md`: Pagination, URL 구조
- `CLAUDE.md`: API 설계 방향

## 중요 설계 포인트

- Category: parentId로 2단계 트리 구조
- Post 목록: Pagination, category 필터, 최신순
- Post URL: `/posts/{slug}-{id}` (slug는 한글 가능)
- Content: Tiptap JSON 형식
- 권한: 쓰기는 admin role만
