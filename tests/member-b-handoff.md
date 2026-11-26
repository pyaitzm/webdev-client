# Member B handoff for Days 5–7

## Data and integration

- `member-b/pazzaStore.ts` holds the course folders, answers, discussions and replies for the running session. The store uses the types in `shared/types.ts`. Refreshing the browser resets the fixtures.
- `PazzaShell.tsx` reads current records for the selected course and post. It supplies the folder filters, New Post form, Class at a Glance and PostView. The post list renders its dates in the browser's locale.
- `member-b/AnswersSection.tsx` and `member-b/FollowUpDiscussions.tsx` use the shared component props for reads and the store for writes. Deleting a discussion removes its replies in the same update. Deleting a reply removes its descendants.
- `manage/folders/page.tsx` reads current folders for the course and checks the current role. `member-b/ManageFolders.tsx` writes changes to the same store.

## Two decisions for integration with Member A

1. When Member A's post deletion succeeds, call `usePazzaStore.getState().removePostData(courseId, postId)`. It is safe to repeat. The regression suite checks that other courses retain their records. On this branch the post menu still previews deletion.
2. The current folder rule blocks the entire bulk delete if any selected folder is referenced by a post. Renaming preserves the folder ID. When replacing the fixture post list with Member A's live store, use all current posts for the course for this check, including private posts. Please confirm this rule and the post-deletion hook when integrating.

## Running the tests

Run `npm ci` and `npx playwright install chromium` once. Run `npx playwright test` for the local development build. The test runner starts the app on loopback port 3037. To use an installed Edge instead, set `PLAYWRIGHT_CHANNEL=msedge`.

Run `npx tsc --noEmit` and `npm run build`. To exercise that production build, set `TEST_PRODUCTION=1` and run `npx playwright test` again. The production test server uses port 3038.

The browser tests use local Kambaz fixtures. The store tests inspect the remaining records after cascading deletes, including records hidden from the UI.

Verified on November 26 with local fixture accounts in headless Edge. All six browser scenarios and both store tests passed against the development server and the production build. TypeScript and the production build passed.
