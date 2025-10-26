# 상태 관리 & 라우팅

## 라우팅 구조

```typescript
<Routes>
  {/* 공개 페이지 */}
  <Route path="/" element={<HomePage />} />
  <Route path="/posts" element={<PostListPage />} />
  <Route path="/posts/:slug-:id" element={<PostDetailPage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* 관리자 전용 */}
  <Route element={<ProtectedRoute />}>
    <Route path="/posts/new" element={<PostEditorPage />} />
    <Route path="/posts/:id/edit" element={<PostEditorPage />} />
    <Route path="/admin/categories" element={<CategoryManagePage />} />
  </Route>
</Routes>
```

## URL 패턴

| 페이지 | URL | 쿼리 |
|--------|-----|------|
| 홈 | `/` | - |
| 글 목록 | `/posts?category=tech&page=2` | category, page |
| 글 상세 | `/posts/리액트-훅스-ckl3q4n5z` | - |
| 글 작성 | `/posts/new` | - |
| 글 수정 | `/posts/ckl3q4n5z/edit` | - |
| 카테고리 관리 | `/admin/categories` | - |

---

## TanStack Query (서버 상태)

```typescript
// 글 목록
useQuery(['posts', { category, page }], () => fetchPosts({ category, page }))

// 글 상세
useQuery(['post', id], () => fetchPost(id))

// 카테고리 목록
useQuery(['categories'], fetchCategories)
```

---

## Zustand (클라이언트 상태)

```typescript
// 인증
const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false })
}))

// 검색 모달
const useSearchModalStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))

// 사이드바 (모바일)
const useSidebarStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}))
```

---

## 권한 관리

```typescript
// ProtectedRoute
function ProtectedRoute() {
  const { isLoggedIn, user } = useAuthStore()
  
  if (!isLoggedIn) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  
  return <Outlet />
}
```

---

## 사용자 플로우

### 글 읽기 (일반 사용자)
1. 홈 접속
2. 카테고리별 최근 글 확인
3. 글 클릭 → 상세 페이지
4. 목차/관련 글로 네비게이션

### 글 검색
1. Header 🔍 클릭
2. 검색 모달 팝업
3. 검색어 입력 + 카테고리 필터
4. 결과에서 글 클릭

### 글 작성 (관리자)
1. Header 프로필 → "글 작성"
2. 제목, 카테고리, 내용 입력
3. 자동저장
4. 요약 생성 (LLM)
5. 저장 → 글 상세로 이동

---

**최종 수정**: 2025-10-25
