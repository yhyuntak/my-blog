# Epic 7: 마무리 및 배포

**목표**: 에러 처리, 반응형 점검, Docker 배포, 테스트
**예상 기간**: Week 6 (24시간)

## 스토리 목록

### Story 7.1: 전역 에러 처리 및 Toast
- **파일**: `docs/backlog/stories/epic7-polish-deploy/7.1-error-handling.md`
- **작업**: Error Boundary, Toast 알림

### Story 7.2: 반응형 디자인 점검
- **파일**: `docs/backlog/stories/epic7-polish-deploy/7.2-responsive-design.md`
- **작업**: 모든 breakpoint 테스트 및 개선

### Story 7.3: Docker 배포 설정
- **파일**: `docs/backlog/stories/epic7-polish-deploy/7.3-docker-deployment.md`
- **작업**: Dockerfile, docker-compose.yml

### Story 7.4: E2E 테스트
- **파일**: `docs/backlog/stories/epic7-polish-deploy/7.4-e2e-testing.md`
- **작업**: Playwright/Cypress로 핵심 flow 테스트

### Story 7.5: 문서화
- **파일**: `docs/backlog/stories/epic7-polish-deploy/7.5-documentation.md`
- **작업**: README, 환경변수, 배포 가이드

## 관련 문서

- `docs/frontend/layout.md`: 반응형 breakpoints
- `CLAUDE.md`: 배포 타겟 (Synology NAS)
- 전체 `docs/` 폴더: 문서화 작업 시 참조

## 중요 설계 포인트

- Error Boundary: React 에러 처리
- Toast: react-hot-toast 등
- 반응형: Mobile/Tablet/Desktop 완전 대응
- Docker: PostgreSQL + Backend + Frontend
- E2E: 로그인, 글 작성, 글 조회 flow
