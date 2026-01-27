# Hover Events & Interaction Rules

> UI 컴포넌트의 호버 상태 및 인터랙션 스타일 가이드

---

## 기본 원칙

1. **일관성**: 같은 타입의 요소는 같은 호버 효과 사용
2. **피드백**: 모든 클릭 가능한 요소는 호버 시 시각적 피드백 제공
3. **부드러움**: transition으로 자연스러운 전환
4. **접근성**: `cursor-pointer`로 클릭 가능함을 명시

---

## 규칙

### 1. 텍스트 링크
**사용처**: 헤더 메뉴, 인라인 링크, 네비게이션

```tsx
<Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
  About
</Link>
```

**스타일:**
- 기본: `text-foreground/60`
- 호버: `hover:text-foreground/80` 또는 `hover:text-foreground`
- 전환: `transition-colors`
- 커서: 자동 (Link 태그)

---

### 2. 버튼 형태
**사용처**: Sign in, 액션 버튼, CTA

```tsx
<button className="px-3 py-1.5 rounded-lg border hover:bg-secondary transition-colors">
  Sign in
</button>
```

**스타일:**
- 기본: `border` (선택적)
- 호버: `hover:bg-secondary`
- 전환: `transition-colors`
- 커서: 자동 (button 태그)
- 추가: `rounded-lg` (일관된 border radius)

---

### 3. 카드 / 리스트 아이템
**사용처**: 포스트 카드, 사이드바 메뉴, 카테고리 링크

```tsx
<Link href="/post" className="block cursor-pointer group">
  <article className="p-6 rounded-lg border hover:bg-secondary/50 hover:shadow-sm transition-all duration-200">
    <h2 className="group-hover:text-primary transition-colors">Title</h2>
  </article>
</Link>
```

**스타일:**
- 기본: `border` 또는 transparent
- 호버: `hover:bg-secondary/50` + `hover:shadow-sm`
- 전환: `transition-all duration-200`
- 커서: `cursor-pointer` (명시적)
- 그룹: `group` + `group-hover:text-primary` (내부 요소 효과)

**선택적 효과:**
- `hover:translate-x-1` - 계층 표현 시 (사이드바 메뉴)

---

### 4. 아이콘 버튼
**사용처**: 다크모드 토글, 검색 버튼, 프로필 메뉴

```tsx
<button className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
  <Icon className="h-5 w-5" />
</button>
```

**스타일:**
- 기본: `p-2 rounded-lg`
- 호버: `hover:bg-secondary`
- 전환: `transition-colors`
- 커서: `cursor-pointer` (명시적)

---

### 5. 드롭다운 토글
**사용처**: Categories, 메뉴 드롭다운

```tsx
<button className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
  Categories
  <ChevronDown className="h-3 w-3" />
</button>
```

**스타일:**
- 기본: `text-foreground/60`
- 호버: `hover:text-foreground/80`
- 전환: `transition-colors`
- 커서: `cursor-pointer` (명시적)

---

## 적용 체크리스트

새 컴포넌트 작성 시 확인:

- [ ] 클릭 가능한 요소에 적절한 호버 효과 적용
- [ ] `transition-*` 클래스로 부드러운 전환
- [ ] button이 아닌 클릭 요소에 `cursor-pointer` 명시
- [ ] 같은 타입의 요소는 같은 규칙 적용
- [ ] 호버 시 시각적 피드백이 명확한가

---

## 예외 상황

### Disabled 상태
```tsx
<button disabled className="opacity-50 cursor-not-allowed hover:bg-transparent">
  Disabled
</button>
```

### 선택된 상태 (Active)
```tsx
<button className={cn(
  "transition-colors",
  isActive ? "bg-secondary text-foreground font-medium" : "hover:bg-secondary text-foreground/60"
)}>
  Active Item
</button>
```

---

**Last Updated**: 2026-01-26
