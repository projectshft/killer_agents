import { ai } from '../libs/gemini';
import { AgentAction } from './agentTypes';
import { z } from 'zod';
import { databaseSearchAgent } from './databaseSearchAgent';
import { trendResearchAgent } from './trendResearchAgent';
import { zodToJsonSchema } from 'zod-to-json-schema';

const routerSchema = z.object({
	action: z
		.enum(['trendResearch', 'databaseSearch'])
		.nullable()
		.optional()
		.describe(
			"the action to take next or null if the query is unclear or doesn't fit any agent"
		),
	query: z
		.string()
		.describe(
			'concise query for next agent to execute OR request to refine the query'
		),
});

export async function executeAgent(query: string) {
	const prompt = `
Take this query: "${query}"

Decide which agent should handle this request:
- "databaseSearch": For searching our database of influencers by price, tier, genre, or location
- "trendResearch": For researching TikTok trends, content ideas, and social media strategies
- null: If the query is unclear or doesn't fit any agent

Provide the action and a refined query for that agent.
	`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.0-flash-exp',
		contents: prompt,
		config: {
			responseMimeType: 'application/json',
			responseJsonSchema: zodToJsonSchema(routerSchema),
		},
	});

	const nextAgent = routerSchema.parse(JSON.parse(response.text ?? '{}'));

	// If no action, return the query which should ask for more information
	if (!nextAgent.action) {
		return {
			agent: 'none',
			message: nextAgent.query,
		};
	}

	// Execute the selected agent
	const action: AgentAction = {
		action: nextAgent.action,
		agentQuery: nextAgent.query,
		originalQuery: query,
	};

	let message = '';
	if (nextAgent.action === 'databaseSearch') {
		message = await databaseSearchAgent(action);
	} else if (nextAgent.action === 'trendResearch') {
		message = await trendResearchAgent(action);
	}

	return { agent: nextAgent.action, message };
}
