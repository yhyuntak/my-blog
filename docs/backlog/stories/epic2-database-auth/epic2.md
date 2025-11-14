# Epic 2: 데이터베이스 및 인증

**목표**: Prisma 스키마 구현 및 이중 인증 시스템 구축
**예상 기간**: Week 2 (40시간)

## 스토리 목록

### Story 2.1: Prisma 스키마 구현
- **파일**: `docs/backlog/stories/epic2-database-auth/2.1-prisma-schema.md`
- **작업**: User, Post, Category 모델 정의

### Story 2.2: Seed 스크립트 작성
- **파일**: `docs/backlog/stories/epic2-database-auth/2.2-seed-script.md`
- **작업**: Admin 사용자 및 초기 카테고리 생성

### Story 2.3: JWT 기반 ID/PW 인증
- **파일**: `docs/backlog/stories/epic2-database-auth/2.3-jwt-auth.md`
- **작업**: 회원가입, 로그인, JWT 발급

### Story 2.4: GitHub OAuth 인증
- **파일**: `docs/backlog/stories/epic2-database-auth/2.4-github-oauth.md`
- **작업**: Passport GitHub Strategy

### Story 2.5: 인증 가드 및 역할 기반 접근 제어
- **파일**: `docs/backlog/stories/epic2-database-auth/2.5-auth-guards.md`
- **작업**: JWT Guard, Role Guard

## 관련 문서

- `docs/database/schema.md`: 데이터베이스 스키마 전체 설계 ⭐
- `docs/decisions/phase1-decisions.md`: 이중 인증 결정 사항
- `CLAUDE.md`: 인증 구조 개요

## 중요 설계 포인트

- User: `username`/`password`와 `githubId`/`githubUsername` 모두 nullable
- Category: 2단계 구조, Seed로 고정 생성 (기술, 일상, 프로젝트)
- bcrypt 패스워드 해싱
- CUID 사용
