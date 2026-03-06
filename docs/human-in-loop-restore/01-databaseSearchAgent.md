# Step 1 - Update databaseSearchAgent

## File path

`app/agents/databaseSearchAgent.ts`

## What to change

Remove the destructive delete block so this agent only returns candidates and marks the request as destructive.

## Find and delete this block

```ts
	// Handle destructive operations directly
	if (sqlProps?.isDestructive) {
		const influencerIds = influencers.map((inf) => inf.id);
		await prisma.influencer.deleteMany({
			where: {
				id: {
					in: influencerIds,
				},
			},
		});

		return {
			message: `Deleted ${influencers.length} influencers matching the query.`,
			isDestructive: true,
			influencers,
		};
	}
```

## Expected behavior after this edit

- Destructive intent still sets `isDestructive`.
- No rows are deleted in this file.
- The agent returns `influencers` for the UI to confirm against.
