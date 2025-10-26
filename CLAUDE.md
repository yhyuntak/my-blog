# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**히포's Tech Blog** - A personal technical blog with a focus on learning and portfolio building. The project emphasizes clean architecture, modern web development practices, and comprehensive documentation.

**Current Status**: Design phase - Database schema, frontend architecture, and Phase 1 decisions finalized. Implementation not yet started.

**Tech Stack**:
- **Monorepo**: Turborepo + pnpm
- **Frontend**: React + Vite, TanStack Query + Zustand
- **Backend**: NestJS
- **Database**: PostgreSQL + Prisma
- **Editor**: Tiptap (Notion-style)
- **Deployment Target**: Synology NAS (Docker + Docker Compose)

---

## Architecture Highlights

### Database Schema (Prisma + PostgreSQL)

**Key Tables**: User, Post, Category

**Unique Design Patterns**:

1. **Hierarchical Category System with Trash**
   - Categories form a tree with max 3 levels (Root/Trash → Category → Subcategory)
   - Root and Trash are system categories (`isSystem: true`)
   - Deletion = moving from Root to Trash (no `deletedAt` field)
   - Recovery = moving back from Trash to Root
   - `depth` field for hierarchy validation (0, 1, 2)

2. **Dual Authentication**
   - ID/PW login: `username` + `password` (bcrypt hashed)
   - GitHub OAuth: `githubId` + `githubUsername`
   - Role-based access: `admin` | `user`
   - Both nullable to support either auth method

3. **Post URL Structure**
   - Format: `/posts/{slug}-{id}`
   - Example: `/posts/리액트-훅스-가이드-ckl3q4n5z`
   - Korean slugs allowed for SEO
   - ID (CUID) for actual lookup, slug for readability

4. **Content Storage**
   - Posts stored as Tiptap JSON (not HTML or Markdown)
   - Enables full editor restoration
   - `excerpt` generated via LLM API (manual trigger)

5. **No Soft Delete**
   - Posts: Physical delete only
   - Categories: Use parentId to move to Trash
   - No `deletedAt` timestamps

### Frontend Architecture

**Layout Structure**:
- Sticky Header (scroll-fixed)
- Left Sidebar: Category tree (collapsible on mobile)
- Right Sidebar: TOC + Related posts (post detail only, hidden on mobile)
- Search Modal: Category filter (left) + realtime results (right)

**Key Pages**:
- Home (`/`): Category-grouped recent posts
- Post List (`/posts?category=tech&page=2`): Pagination, category filter
- Post Detail (`/posts/:slug-:id`): 3-column layout (LSB + content + RSB)
- Login (`/login`): ID/PW + GitHub OAuth buttons
- Post Editor (`/posts/new`): Tiptap editor, auto-save, LLM summary
- Category Admin (`/admin/categories`): Tree with drag-drop, trash management

**Routing**:
- Public: `/`, `/posts`, `/posts/:slug-:id`, `/login`
- Protected: `/posts/new`, `/posts/:id/edit`, `/admin/categories`

**State Management**:
- TanStack Query: Server state (posts, categories)
- Zustand: Client state (auth, modals, sidebar)

---

## Documentation Structure

All design documents are in `docs/`:

```
docs/
├── README.md                      # Documentation index
├── decisions/
│   └── phase1-decisions.md        # Phase 1 feature decisions
├── database/
│   └── schema.md                  # Full database schema
└── frontend/
    ├── README.md                  # Frontend docs index
    ├── layout.md                  # Header, sidebars, search modal
    ├── components.md              # Component list
    ├── state-management.md        # Routing & state
    └── pages/                     # Page-by-page layouts (ASCII art)
        ├── home.md
        ├── post-list.md
        ├── post-detail.md
        ├── login.md
        ├── post-editor.md
        └── category-manage.md
```

**Always refer to these docs before implementing features.** They contain detailed specifications, ASCII art layouts, and design rationale.

---

## Key Design Decisions

### Phase 1 (from `docs/decisions/phase1-decisions.md`)

1. **Authentication**: Implement both ID/PW and GitHub OAuth for learning
2. **Public/Private**: Use `isPublic` boolean (Notion-style), no draft concept
3. **Auto-save**: Implement with debounce (specifics TBD)
4. **Pagination**: Use pagination (not infinite scroll) for SEO
5. **Editor**: Tiptap for Notion-style realtime rendering

### Data Patterns

- **IDs**: CUID (not UUID or auto-increment)
- **Slugs**: Korean allowed, combined with ID in URLs
- **Category Depth**: Max 3 levels, validated via `depth` field
- **Timestamps**: `createdAt` + `updatedAt` only (no audit fields)
- **Indexes**: Add when needed (performance-first approach)

### Frontend Patterns

- **Responsive**: Mobile (≤768px), Tablet (769-1024px), Desktop (≥1025px)
- **LSB**: Always visible on desktop, hamburger menu on mobile
- **RSB**: Post detail only, hidden on mobile/tablet
- **Search**: Modal with category filter, debounced input
- **Category Filter**: Query params (`?category=tech&page=2`)

---

## Implementation Notes

### When Implementing Database

1. Use Prisma schema generator
2. Create seed script for Root/Trash categories and admin user
3. Validate category depth on create/move
4. Hash passwords with bcrypt
5. Store Tiptap content as JSON (stringified)

### When Implementing Frontend

1. Use React Router for routing
2. ProtectedRoute for admin pages
3. TanStack Query for server data
4. Zustand for auth, modals, sidebar state
5. Tiptap React wrapper for editor
6. Implement debounced auto-save (interval TBD)

### When Implementing Backend

1. NestJS modular structure
2. JWT for ID/PW auth
3. Passport GitHub strategy for OAuth
4. Role guards for admin routes
5. Prisma client for database
6. Validate category operations (depth, system flag)

---

## Deferred to Later Phases

- **Phase 2**: Comments (GitHub OAuth), replies
- **Phase 3**: Docker deployment, Nginx, SSL
- **Phase 4**: Tags, search, views, related posts, RSS

---

## Important Constraints

1. **Category Hierarchy**: Enforce max 3 levels in application logic
2. **System Categories**: Root/Trash cannot be edited or deleted
3. **Korean Slugs**: Ensure URL encoding support
4. **Tiptap JSON**: Don't convert to HTML for storage
5. **No Soft Delete**: Posts deleted permanently (warn user)
6. **Single Admin**: Initially one admin account via seed

---

## Next Steps (Post-Design)

1. API endpoint design
2. Authentication/authorization strategy details
3. Project initialization (Turborepo setup)
4. Prisma schema implementation
5. Development environment setup

**Refer to DESIGN.md for phase breakdown and feature roadmap.**
