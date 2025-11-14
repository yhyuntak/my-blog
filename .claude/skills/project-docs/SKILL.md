---
name: project-docs
description: Phase 1 백로그 스토리 작업 시 사용. Epic별 스토리 목록과 관련 문서를 제공하여 토큰 효율적으로 컨텍스트를 로드함.
---

# Project Documentation Navigator

이 Skill은 Phase 1 백로그의 Epic별 작업 시 필요한 컨텍스트를 제공합니다.

## Epic별 문서

작업하려는 Epic에 따라 해당 폴더의 epicN.md 파일을 참조하세요:

- **Epic 1 (인프라 및 프로젝트 설정)**: `docs/backlog/stories/epic1-infrastructure/epic1.md`
- **Epic 2 (데이터베이스 및 인증)**: `docs/backlog/stories/epic2-database-auth/epic2.md`
- **Epic 3 (백엔드 API 개발)**: `docs/backlog/stories/epic3-backend-apis/epic3.md`
- **Epic 4 (프론트엔드 기반)**: `docs/backlog/stories/epic4-frontend-foundation/epic4.md`
- **Epic 5 (핵심 페이지 구현)**: `docs/backlog/stories/epic5-pages/epic5.md`
- **Epic 6 (에디터 구현)**: `docs/backlog/stories/epic6-editor/epic6.md`
- **Epic 7 (마무리 및 배포)**: `docs/backlog/stories/epic7-polish-deploy/epic7.md`

## 사용 방법

사용자가 특정 Epic이나 Story 작업을 요청하면:
1. 해당 Epic의 문서 파일(epicN.md) 참조
2. 필요한 스토리 파일들의 경로 확인
3. 관련 설계 문서 확인
4. Progressive Enhancement 방식으로 구현

## 전역 참조 문서

모든 Epic 작업 시 참고:
- `CLAUDE.md`: 프로젝트 전체 컨텍스트
- `docs/decisions/phase1-decisions.md`: Phase 1 설계 결정사항
