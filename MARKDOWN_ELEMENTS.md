# 마크다운 렌더링 HTML 요소 목록

TipTap과 Tailwind Typography에서 사용하는 모든 마크다운 요소들

---

## 텍스트 요소

### 제목 (Headings)
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```
→ HTML: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

### 단락 (Paragraph)
```markdown
This is a paragraph.
```
→ HTML: `<p>`

### 강조 (Emphasis)
```markdown
**bold** or __bold__
*italic* or _italic_
~~strikethrough~~
```
→ HTML: `<strong>`, `<em>`, `<s>` 또는 `<del>`

---

## 링크 & 이미지

### 링크 (Links)
```markdown
[Link text](https://example.com)
```
→ HTML: `<a href="...">`

### 이미지 (Images)
```markdown
![Alt text](https://example.com/image.jpg)
```
→ HTML: `<img src="..." alt="...">`

---

## 코드

### 인라인 코드 (Inline Code)
```markdown
`code`
```
→ HTML: `<code>`

### 코드 블록 (Code Block)
````markdown
```javascript
const hello = "world";
```
````
→ HTML: `<pre><code>`

---

## 리스트

### 순서 없는 리스트 (Unordered List)
```markdown
- Item 1
- Item 2
  - Nested item
```
→ HTML: `<ul>`, `<li>`

### 순서 있는 리스트 (Ordered List)
```markdown
1. First
2. Second
3. Third
```
→ HTML: `<ol>`, `<li>`

---

## 인용문 & 구분선

### 인용문 (Blockquote)
```markdown
> This is a quote
```
→ HTML: `<blockquote>`

### 구분선 (Horizontal Rule)
```markdown
---
***
___
```
→ HTML: `<hr>`

---

## 테이블 (GitHub Flavored Markdown)

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```
→ HTML: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`

---

## Tailwind Typography가 스타일링하는 전체 요소

`.prose` 클래스를 적용하면 아래 요소들에 자동으로 스타일이 적용됩니다:

### 기본 텍스트
- `p` - 단락
- `a` - 링크
- `strong` - 굵은 텍스트
- `em` - 기울임 텍스트
- `code` - 인라인 코드

### 제목
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`

### 리스트
- `ul` - 순서 없는 리스트
- `ol` - 순서 있는 리스트
- `li` - 리스트 아이템

### 코드 블록
- `pre` - 코드 블록 컨테이너
- `pre code` - 코드 블록 내부 코드

### 인용문 & 구분선
- `blockquote` - 인용문
- `hr` - 수평선

### 테이블
- `table`
- `thead`, `tbody`
- `tr` - 테이블 행
- `th` - 테이블 헤더
- `td` - 테이블 셀

### 미디어
- `img` - 이미지
- `video` - 비디오
- `figure` - Figure 요소
- `figcaption` - Figure 캡션

---

## 현재 적용된 커스텀 스타일 위치

`/app/globals.css` 파일에서 다음을 override 중:

```css
.prose :where(h1, h2, h3, h4, h5, h6) { ... }
.prose :where(p) { ... }
.prose :where(ul, ol) { ... }
.prose :where(li) { ... }
.prose :where(pre) { ... }
.prose :where(blockquote) { ... }
```

---

## 스타일 커스터마이징 방법

### 방법 1: globals.css에서 override
```css
.prose :where(ELEMENT):not(:where([class~="not-prose"] *)) {
  /* 커스텀 스타일 */
}
```

### 방법 2: TipTap 설정에서 HTMLAttributes 사용
```typescript
StarterKit.configure({
  heading: {
    HTMLAttributes: {
      class: "custom-heading-class"
    }
  }
})
```

---

**Last Updated**: 2026-01-27
