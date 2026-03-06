# Step 2 - Add confirmation UI and action call

## File path

`app/page.tsx`

## 1) Add imports

Add these two imports near the top:

```ts
import { Influencer } from '@prisma/client';
import { deleteInfluencersAction } from './actions/deleteInfluencersAction';
```

## 2) Add destructive submit handler

Add this function below `handleSubmit`:

```ts
	const handleDestructiveSubmit = async () => {
		if (!agentResult?.isDestructive) return;

		setIsLoading(true);
		setAgentResult(null);

		const deletedInfluencers = await deleteInfluencersAction(
			agentResult?.influencers ?? [],
		);
		if (deletedInfluencers > 0) {
			setAgentResult({
				message: `Influencers deleted successfully: ${deletedInfluencers}`,
				isDestructive: false,
				influencers: [],
				agent: 'deleteInfluencersAction',
			});
			setIsLoading(false);
		}
	};
```

## 3) Add destructive confirmation UI

Add this block near the bottom of JSX in `return` (after the results block):

```tsx
				{agentResult?.isDestructive && (
					<div className='flex flex-col gap-2'>
						<h2 className='text-xl font-semibold text-green-300'>
							Are you sure you want to proceed? You will not be
							able to undo this action. This will delete the
							following influencers:
							{agentResult?.influencers?.map(
								(influencer: Influencer) => (
									<div key={influencer.id}>
										{influencer.name}
									</div>
								),
							)}
						</h2>
						<button
							onClick={handleDestructiveSubmit}
							disabled={isLoading}
							className='h-12 border border-red-500 bg-black px-6 font-medium text-red-300 transition-colors hover:bg-red-950 disabled:opacity-50'
						>
							{isLoading
								? 'Processing...'
								: 'Click to delete these influencers'}
						</button>
					</div>
				)}
```

## Expected behavior after this edit

- Destructive query shows a warning + influencer list.
- Nothing is deleted until user clicks confirm button.
- Confirmation path calls `deleteInfluencersAction`.
