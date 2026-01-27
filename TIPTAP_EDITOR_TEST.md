# TipTap WYSIWYG Editor Test Checklist

## Installation & Integration ✅
- [x] TipTap packages installed (@tiptap/react, @tiptap/starter-kit, @tiptap/markdown, @tiptap/extension-placeholder)
- [x] Editor component created (components/editor/tiptap-editor.tsx)
- [x] Integrated into PostForm (replaced textarea)
- [x] TypeScript build passes
- [x] Dark mode styles added

## Browser Testing (To Be Completed by User)

### Initial Load
- [ ] Navigate to http://localhost:3000/admin/posts/new
- [ ] Editor loads without errors
- [ ] Placeholder text appears: "Start writing... Type markdown and see it come to life!"
- [ ] No console errors
- [ ] No SSR hydration errors

### Formatting Features
Test each feature by typing:

- [ ] **Headings**: Type `# Heading 1` and press Enter - should render as large heading
- [ ] **Headings**: Type `## Heading 2` and press Enter - should render as medium heading
- [ ] **Bold**: Type `**bold text**` - should render as bold
- [ ] **Italic**: Type `*italic text*` - should render as italic
- [ ] **Strikethrough**: Type `~~strikethrough~~` - should render with line through
- [ ] **Inline Code**: Type `` `code` `` - should render with gray background
- [ ] **Code Block**: Type ` ```javascript ` then Enter, add code, then ` ``` ` - should render as code block
- [ ] **Bullet List**: Type `- Item 1` and press Enter - should create bullet list
- [ ] **Numbered List**: Type `1. Item 1` and press Enter - should create numbered list
- [ ] **Blockquote**: Type `> Quote` and press Enter - should render with left border
- [ ] **Link**: Type `[Link text](https://example.com)` - should render as clickable link
- [ ] **Horizontal Rule**: Type `---` and press Enter - should create horizontal line

### Keyboard Shortcuts (StarterKit defaults)
- [ ] `Cmd+B` (Mac) / `Ctrl+B` (Windows) - Toggle bold
- [ ] `Cmd+I` (Mac) / `Ctrl+I` (Windows) - Toggle italic
- [ ] `Cmd+Shift+X` - Toggle strikethrough
- [ ] `Cmd+E` - Toggle code
- [ ] `Cmd+Shift+8` - Toggle bullet list
- [ ] `Cmd+Shift+7` - Toggle ordered list

### Dark Mode
- [ ] Switch to dark mode (toggle theme button)
- [ ] Editor background matches dark theme
- [ ] Text is readable (proper contrast)
- [ ] Code blocks visible in dark mode
- [ ] Placeholder text visible in dark mode
- [ ] Border colors appropriate for dark mode

### Form Integration
- [ ] Type content in editor
- [ ] Content appears in real-time (WYSIWYG)
- [ ] Click "Generate Metadata" button - should use editor content
- [ ] Fill other fields (title, category, etc.)
- [ ] Click "Create Post" button
- [ ] Post saves successfully with markdown content

### Edit Existing Post
- [ ] Create a test post
- [ ] Go to edit page (/admin/posts/[slug]/edit)
- [ ] Editor loads with existing markdown content
- [ ] Content renders correctly (headings, bold, lists, etc.)
- [ ] Edit content
- [ ] Save changes
- [ ] Verify changes persist

### Markdown Round-Trip
- [ ] Create post with various markdown elements
- [ ] Save post
- [ ] Edit post again
- [ ] Verify all markdown formatting preserved
- [ ] Check raw database content matches markdown syntax

### Performance
- [ ] Editor loads quickly (< 1 second)
- [ ] No lag while typing
- [ ] Smooth rendering of formatting changes

### Mobile Responsiveness (Optional)
- [ ] Open on mobile device or responsive mode
- [ ] Editor is usable on small screens
- [ ] Formatting options accessible

## Known Limitations
- No slash commands (/) - basic editor only
- No floating/bubble menu - basic editor only
- No image drag & drop - basic editor only
- No syntax highlighting for code blocks - basic editor only
- These can be added later if needed

## If Issues Found
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify markdown is being saved correctly in database
4. Test in both light and dark modes
5. Try different browsers (Chrome, Firefox, Safari)

## Success Criteria
✅ All formatting features work
✅ Dark mode displays correctly
✅ Content saves as markdown
✅ Editing existing posts works
✅ No console errors
✅ No performance issues

---

**Testing URL**: http://localhost:3000/admin/posts/new
**Last Updated**: 2026-01-27
