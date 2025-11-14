# Epic 5: 핵심 페이지 구현

**목표**: 로그인, 홈, 글 목록, 글 상세 페이지 구현
**예상 기간**: Week 5 전반 (40시간)

## 스토리 목록

### Story 5.1: 로그인 페이지
- **파일**: `docs/backlog/stories/epic5-pages/5.1-login-page.md`
- **작업**: ID/PW 폼 + GitHub OAuth 버튼

### Story 5.2: 홈 페이지
- **파일**: `docs/backlog/stories/epic5-pages/5.2-home-page.md`
- **작업**: 카테고리별 최신 글 그룹핑

### Story 5.3: 글 목록 페이지
- **파일**: `docs/backlog/stories/epic5-pages/5.3-post-list-page.md`
- **작업**: Pagination, category 필터

### Story 5.4: 글 상세 페이지
- **파일**: `docs/backlog/stories/epic5-pages/5.4-post-detail-page.md`
- **작업**: 3컬럼 레이아웃 (LSB + Content + RSB)

## 관련 문서

- `docs/frontend/pages/login.md`: 로그인 페이지 레이아웃 ⭐
- `docs/frontend/pages/home.md`: 홈 페이지 레이아웃 ⭐
- `docs/frontend/pages/post-list.md`: 글 목록 레이아웃 ⭐
- `docs/frontend/pages/post-detail.md`: 글 상세 레이아웃 ⭐
- `docs/frontend/layout.md`: 전체 레이아웃 구조
- `docs/decisions/phase1-decisions.md`: Pagination, URL 구조

## 중요 설계 포인트

- 로그인: 중앙 정렬 카드
- 홈: 카테고리별 최대 3개씩
- 목록: 페이지네이션, 쿼리 파라미터
- 상세: RSB에 TOC + 관련 글, Mobile에서는 숨김
