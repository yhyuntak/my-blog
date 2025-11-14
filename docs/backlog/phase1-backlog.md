# Phase 1 Backlog

## 작성 정보
- **작성일**: 2025-11-14
- **목표**: Phase 1 MVP 완성 및 배포 준비
- **기간**: 6주 (240시간, 주당 40시간 기준)
- **개발자**: 히포 (솔로 주니어 개발자)
- **배포 목표**: 6주 후 Synology NAS 배포

---

## Epic 개요

### Epic 1: 인프라 및 프로젝트 설정
**목표**: 개발 환경 구축 및 모노레포 설정
**예상 기간**: Week 1 (32시간)
**스토리**: 4개 (1.1 ~ 1.4)

### Epic 2: 데이터베이스 및 인증 구현
**목표**: User, Category, Post 테이블 생성 및 인증 시스템 구현
**예상 기간**: Week 1-2 (40시간)
**스토리**: 5개 (2.1 ~ 2.5)

### Epic 3: 백엔드 API 구현
**목표**: Post, Category CRUD API 완성
**예상 기간**: Week 2-3 (32시간)
**스토리**: 3개 (3.1 ~ 3.3)

### Epic 4: 프론트엔드 기초 구현
**목표**: 레이아웃, 상태관리, 공통 컴포넌트 구현
**예상 기간**: Week 3 (32시간)
**스토리**: 4개 (4.1 ~ 4.4)

### Epic 5: 주요 페이지 구현
**목표**: 홈, 글 목록, 글 상세, 로그인 페이지 완성
**예상 기간**: Week 3-4 (40시간)
**스토리**: 4개 (5.1 ~ 5.4)

### Epic 6: 글 작성 및 에디터 구현
**목표**: Tiptap 에디터로 글 작성/수정 기능 완성
**예상 기간**: Week 4-5 (32시간)
**스토리**: 3개 (6.1 ~ 6.3)

### Epic 7: 통합 및 마무리
**목표**: 전체 기능 통합, 버그 수정, 배포 준비
**예상 기간**: Week 5-6 (32시간)
**스토리**: 5개 (7.1 ~ 7.5)

---

## 전체 타임라인

### Week 1 (40시간)
**Epic 1 + Epic 2 일부**
- Story 1.1-1.4: 인프라 설정 (32h)
- Story 2.1: Prisma 스키마 (8h)

**목표**: 개발 환경 완성 및 DB 준비

---

### Week 2 (40시간)
**Epic 2 완료 + Epic 3 시작**
- Story 2.2-2.5: 인증 시스템 (40h)

**목표**: 인증 시스템 완성

**체크포인트**:
- [ ] Postman으로 모든 인증 API 테스트 성공
- [ ] Prisma Studio에서 User, Category 데이터 확인

---

### Week 3 (40시간)
**Epic 3 완료 + Epic 4**
- Story 3.1-3.3: 백엔드 API (32h)
- Story 4.1-4.2: 프론트 기초 (8h)

**목표**: 백엔드 API 완성 + 프론트 시작

---

### Week 4 (40시간)
**Epic 4 완료 + Epic 5 시작 + Epic 6 시작**
- Story 4.3-4.4: 레이아웃 완성 (20h)
- Story 5.1: 로그인 페이지 (16h)
- Story 6.1: Tiptap 초기 설정 (4h)

**목표**: 주요 레이아웃 + 로그인 완성

**체크포인트**:
- [ ] 모든 백엔드 API 완성
- [ ] Header + LSB 렌더링 확인

---

### Week 5 (40시간)
**Epic 5 완료 + Epic 6 일부**
- Story 5.2-5.4: 주요 페이지 (40h)

**목표**: 모든 페이지 완성

---

### Week 6 (40시간)
**Epic 6 완료 + Epic 7 완료**
- Story 6.2-6.3: 에디터 페이지 (20h)
- Story 7.1-7.5: 통합 및 마무리 (20h)

**목표**: MVP 완성 + 배포 준비

**체크포인트**:
- [ ] 글 작성 → 저장 → 상세 확인 E2E 성공
- [ ] Docker Compose 로컬 배포 성공

---

## 우선순위

### Critical Path (반드시 완료)
1. Epic 1 → Epic 2 → Epic 3 (백엔드 기초)
2. Epic 4 → Epic 5 → Epic 6 (프론트엔드 핵심)
3. Story 7.3 (Docker 배포)

### High Priority (MVP 필수)
- 모든 Epic 1-6
- Story 7.1, 7.2, 7.3

### Medium Priority (품질 향상)
- Story 7.4 (E2E 테스트)

### Low Priority (나중에 가능)
- Story 7.5 (문서화 - 최소한으로)

---

## 상세 스토리

각 스토리의 상세 내용은 `docs/backlog/stories/` 폴더 참조:

- **Epic 1**: `stories/epic1-infrastructure/`
- **Epic 2**: `stories/epic2-database-auth/`
- **Epic 3**: `stories/epic3-backend-apis/`
- **Epic 4**: `stories/epic4-frontend-foundation/`
- **Epic 5**: `stories/epic5-pages/`
- **Epic 6**: `stories/epic6-editor/`
- **Epic 7**: `stories/epic7-polish-deploy/`

---

## 성공 기준

### Phase 1 MVP 완성 조건
- [x] 관리자 로그인 (ID/PW + GitHub OAuth)
- [x] 글 작성/수정/삭제
- [x] Tiptap 에디터 정상 작동
- [x] 글 목록, 상세, 카테고리 필터
- [x] 반응형 디자인 (모바일 지원)
- [x] Docker Compose 배포 가능

### 선택 사항 (Phase 2로 미룰 수 있음)
- [ ] 검색 모달
- [ ] 자동저장
- [ ] 카테고리 관리 UI
- [ ] Excerpt LLM 생성
- [ ] Synology NAS 실배포 (Phase 3)

---

**총 예상 시간**: 232시간 (버퍼 8시간)
**최종 수정**: 2025-11-14
