'use client';

import { useState } from 'react';
import { executeAgent, type ExecuteAgentResult } from './agents/executeAgent';
import ReactMarkdown from 'react-markdown';

export default function Home() {
	const [query, setQuery] = useState('');
	const [agentResult, setAgentResult] = useState<ExecuteAgentResult | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!query.trim()) return;

		setIsLoading(true);
		setAgentResult(null);

		try {
			const result = await executeAgent(query);
			setAgentResult(result);
		} catch (error) {
			console.error('Error:', error);
			setAgentResult({
				message: 'An error occurred while processing your request.',
				isDestructive: false,
				influencers: [],
				agent: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-black font-mono text-green-400'>
			<main className='flex min-h-screen w-full max-w-3xl flex-col gap-8 px-8 py-16'>
				<div className='flex flex-col gap-4'>
					<div className='flex items-center justify-between'>
						<h1 className='text-3xl font-semibold tracking-wide text-green-300'>
							Creator Database Terminal
							<span className='as400-cursor' aria-hidden='true' />
						</h1>
					</div>
					<textarea
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Enter your query...'
						className='as400-input min-h-[200px] w-full border border-green-600 bg-black p-4 text-green-300 placeholder:text-green-700 focus:outline-none focus:ring-1 focus:ring-green-500'
					/>
					<button
						onClick={handleSubmit}
						disabled={isLoading}
						className='h-12 border border-green-500 bg-black px-6 font-medium text-green-300 transition-colors hover:bg-green-950 disabled:opacity-50'
					>
						{isLoading ? 'Processing...' : 'Submit'}
					</button>
				</div>

				{agentResult?.agent && (
					<div className='flex flex-col gap-2'>
						<h2 className='text-xl font-semibold text-green-300'>
							Agent
						</h2>
						<span className='inline-block w-fit border border-green-600 bg-black px-4 py-2 text-sm font-medium text-green-300'>
							{agentResult.agent}
						</span>
					</div>
				)}

				{agentResult?.message && (
					<div className='flex flex-col gap-4 border border-green-600 bg-black p-6'>
						<h2 className='text-xl font-semibold text-green-300'>
							Results
						</h2>
						<div className='prose prose-invert max-w-none text-green-300'>
							<ReactMarkdown>{agentResult.message}</ReactMarkdown>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
