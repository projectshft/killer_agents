'use client';

import { useState } from 'react';
import { executeAgent } from './actions';
import ReactMarkdown from 'react-markdown';

export default function Home() {
	const [query, setQuery] = useState('');
	const [agent, setAgent] = useState<string | null>(null);
	const [result, setResult] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!query.trim()) return;

		setIsLoading(true);
		setAgent(null);
		setResult(null);

		try {
			const result = await executeAgent(query);
			setAgent(result.agent);
			setResult(result.message);
		} catch (error) {
			console.error('Error:', error);
			setResult('An error occurred while processing your request.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
			<main className='flex min-h-screen w-full max-w-3xl flex-col gap-8 py-32 px-16'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-3xl font-semibold text-black dark:text-zinc-50'>
						Social Media Agent
					</h1>
					<textarea
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Enter your query...'
						className='min-h-[200px] w-full rounded-lg border border-zinc-300 bg-white p-4 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50'
					/>
					<button
						onClick={handleSubmit}
						disabled={isLoading}
						className='h-12 rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200'
					>
						{isLoading ? 'Processing...' : 'Submit'}
					</button>
				</div>

				{agent && (
					<div className='flex flex-col gap-2'>
						<h2 className='text-xl font-semibold text-black dark:text-zinc-50'>
							Agent:
						</h2>
						<span className='inline-block w-fit rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-black dark:bg-zinc-800 dark:text-zinc-50'>
							{agent}
						</span>
					</div>
				)}

				{result && (
					<div className='flex flex-col gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900'>
						<h2 className='text-xl font-semibold text-black dark:text-zinc-50'>
							Results
						</h2>
						<div className='prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300'>
							<ReactMarkdown>{result}</ReactMarkdown>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
