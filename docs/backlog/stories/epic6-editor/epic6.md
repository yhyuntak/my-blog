# Epic 6: 에디터 구현

**목표**: Tiptap 에디터 설정 및 글 작성/수정 페이지
**예상 기간**: Week 5 후반 (24시간)

## 스토리 목록

### Story 6.1: Tiptap 에디터 설정
- **파일**: `docs/backlog/stories/epic6-editor/6.1-tiptap-setup.md`
- **작업**: Tiptap React 컴포넌트, Extensions 설정

### Story 6.2: 글 작성 페이지
- **파일**: `docs/backlog/stories/epic6-editor/6.2-post-editor-new.md`
- **작업**: /posts/new, 제목/카테고리/에디터/excerpt/isPublic

### Story 6.3: 글 수정 페이지
- **파일**: `docs/backlog/stories/epic6-editor/6.3-post-editor-edit.md`
- **작업**: /posts/:id/edit, 기존 데이터 로드

## 관련 문서

- `docs/frontend/pages/post-editor.md`: 에디터 페이지 레이아웃 ⭐
- `docs/database/schema.md`: Post.content (Tiptap JSON)
- `docs/decisions/phase1-decisions.md`: 수동 저장, Tiptap 사용
- `CLAUDE.md`: 에디터 기술 스택

## 중요 설계 포인트

- Tiptap: Notion-style 실시간 렌더링
- Extensions: Heading, Paragraph, Bold, Italic, Code, CodeBlock, Link, Image
- Content: JSON 형식으로 저장 (HTML 변환 없음)
- 수동 저장: 저장 버튼만 (자동저장 없음)
- excerpt: 수동 입력 (Phase 1에서 LLM 미사용)
- Admin 권한 필요
