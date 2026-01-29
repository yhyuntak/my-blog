# Session: 2026-01-29 Draft System & Hydration Fix

## Context

Session focused on fixing a React hydration error caused by timezone mismatches and implementing a complete admin draft system to allow admins to preview unpublished content while keeping it hidden from regular users.

## Work Summary

### Bug Fixes
- **GROK_API_KEY typo**: Fixed environment variable name from `GROK_API_KE` to `GROK_API_KEY`
- **Hydration Error #418**: Resolved date mismatch between server (UTC) and client (KST) by standardizing all date formatting to UTC in `lib/utils.ts`

### ISR (Incremental Static Regeneration)
- Added ISR configuration to make new posts visible within 60 seconds instead of requiring full rebuild
- Improves development experience and deployment workflow

### Admin Draft System
- **Data Layer**: Modified `lib/posts.ts` to add `published` field to PostPreview type and `includeDraft` parameter to `getAllPosts()`
- **Authorization**: Admin users can view all posts (published + draft); regular users see only published posts
- **UI Components**:
  - `components/post-card.tsx`: Added Draft badge on card
  - `app/home-client.tsx`: Pass `isAdmin` prop, render Draft badge when applicable
- **Pages Updated**:
  - `app/page.tsx`: Check admin status and fetch posts accordingly
  - `app/posts/[slug]/page.tsx`: Allow admin draft preview with Draft banner
  - `app/category/[slug]/page.tsx`: Support draft filtering
  - `app/admin/page.tsx`: Added post list section showing all posts with Published/Draft status indicator

## Problems & Solutions

| Problem | Solution |
|---------|----------|
| React hydration mismatch on date display | Standardized date formatting to UTC in `formatDate()` utility to match server render |
| Timezone issues (UTC vs KST) | Use consistent timezone in all date operations (UTC as source of truth) |
| GROK_API_KEY environment variable typo | Corrected variable name in configuration |
| Admins couldn't preview draft posts | Implemented `includeDraft` parameter in post fetching with admin auth check |

## Decisions

- **Timezone Handling**: All dates now use UTC as source of truth, formatted at display time for consistency across server/client
- **Draft Visibility**: Draft posts controlled entirely by `published` field in Prisma schema; visibility logic in `getAllPosts()` ensures clean separation of concerns
- **UI Pattern**: Draft status shown as badge on cards and banner on detail pages for clear user communication
- **Admin Dashboard**: Post list displays all posts regardless of status for admin content management

## Incomplete/TODO

- [ ] Post editing interface (admin can't modify draft status yet)
- [ ] Draft post scheduling (publish_date field not yet implemented)
- [ ] Bulk operations for draft posts
- [ ] Draft post analytics/metrics in admin dashboard

## Affected Files

- `/Users/yoohyuntak/workspace/my-blog/lib/utils.ts` - UTC date formatting
- `/Users/yoohyuntak/workspace/my-blog/lib/posts.ts` - Post fetching logic with draft support
- `/Users/yoohyuntak/workspace/my-blog/app/page.tsx` - Home page admin check
- `/Users/yoohyuntak/workspace/my-blog/app/home-client.tsx` - Draft badge rendering
- `/Users/yoohyuntak/workspace/my-blog/app/posts/[slug]/page.tsx` - Draft preview & banner
- `/Users/yoohyuntak/workspace/my-blog/app/category/[slug]/page.tsx` - Category filtering
- `/Users/yoohyuntak/workspace/my-blog/components/post-card.tsx` - Draft badge UI
- `/Users/yoohyuntak/workspace/my-blog/app/admin/page.tsx` - Admin post list

## Next Session Suggestions

1. Implement post editing interface to allow admins to toggle draft status
2. Add scheduled publishing with `publish_date` field
3. Create draft post audit trail (created_at, updated_at tracking)
4. Add bulk publish/unpublish actions in admin dashboard
5. Consider draft notification system for team collaboration
