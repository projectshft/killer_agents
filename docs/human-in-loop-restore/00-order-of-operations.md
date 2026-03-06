# Human-in-Loop Restore Order

Goal: make `human-in-loop-needs-fixing` behave like `human-in-loop-agent` for destructive actions.

## Step 1 (backend safety behavior)

Update `app/agents/databaseSearchAgent.ts` first so destructive queries no longer delete immediately.

Use: `docs/human-in-loop-restore/01-databaseSearchAgent.md`

## Step 2 (frontend confirmation flow)

Update `app/page.tsx` to show a confirmation UI and call `deleteInfluencersAction` only after explicit user confirmation.

Use: `docs/human-in-loop-restore/02-page-confirmation-ui.md`

## Step 3 (manual verification)

1. Start app: `yarn dev`
2. Run a safe query: `find creators in miami`
3. Run a destructive query: `delete creators in miami`
4. Confirm behavior:
   - You should first see a confirmation list/button.
   - Records should only be deleted after clicking the delete button.
