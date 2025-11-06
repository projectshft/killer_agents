import { AgentAction } from './agentTypes';
import { getJson } from 'serpapi';
import { ai } from '../libs/gemini';

export const trendResearchAgent = async (agentAction: AgentAction) => {
	const apiKey = process.env.SERP_API_KEY;

	const params = {
		engine: 'google',
		api_key: apiKey,
		q: `TikTok ${agentAction.agentQuery}`,
	};

	const results = await getJson(params);

	const organicResults = results.organic_results || [];

	if (organicResults.length === 0) {
		return 'No trend research results found for your query.';
	}

	// Extract top 5 results
	const topResults = organicResults
		.slice(0, 5)
		.map((result: { title?: string; snippet?: string; link?: string }) => ({
			title: result.title || 'No title',
			snippet: result.snippet || 'No description',
			link: result.link || 'N/A',
		}));

	// Create a prompt for summarization focused on trends
	const prompt = `
Based on the following search results about TikTok trends for "${
		agentAction.agentQuery
	}", provide a comprehensive summary focused on social media trends and content ideas.

Search results:
${topResults
	.map(
		(
			r: {
				title: string;
				snippet: string;
				link: string;
			},
			i: number
		) => `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.link}`
	)
	.join('\n\n')}

Please provide a summary that:
1. Identifies current TikTok trends related to the query
2. Suggests content ideas or campaign strategies
3. Mentions popular hashtags or themes
4. Includes relevant links for further reading

Format your response in a readable way with paragraphs and bullet points where appropriate.
	`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.0-flash-exp',
		contents: prompt,
	});

	const summary = response.text || 'Unable to generate summary.';
	console.log('Trend Research Agent - Summary:', summary);

	return summary;
};
