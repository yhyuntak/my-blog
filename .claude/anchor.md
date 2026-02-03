# Anchor

블로그 페이지 전환 성능 최적화 - 현재 1-3초 걸리는 페이지 이동을 200ms 이하로 개선

**Started**: 2026-02-03
**Completed**: 2026-02-03

## 완료된 작업

### Phase 1-6: 코드 최적화
- Header: unstable_cache + Suspense 적용
- 데이터: getRecentPosts 함수 생성, Admin 쿼리 제한
- Search: 경량 API + Fuse.js dynamic import
- Loading: 각 라우트에 Skeleton UI
- 번들: 미사용 패키지 제거 (14개)

### Phase 7-8: 지식 정리
- PARA Resources에 문서 저장
  - architecture/ssr-performance.md
  - nextjs/optimization.md
- save-para 스킬 개선 피드백 저장
