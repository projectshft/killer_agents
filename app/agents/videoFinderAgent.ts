import { AgentAction } from './agentTypes';
import { ai } from '../libs/gemini';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getJson } from 'serpapi';

/**
 * STUDENT CHALLENGE: YouTube Video Finder Agent
 *
 * Goal: Build an agent that finds YouTube videos on any topic
 *
 * This agent should:
 * 1. Take a search query from the user
 * 2. Search YouTube using SerpAPI
 * 3. Use an LLM to analyze and filter results
 * 4. Return formatted YouTube video links
 */

// TODO Step 1: Define the schema for YouTube results
// This schema structures the LLM's analysis of search results
// Hint: You need url, title, description, and channel
const youtubeResultsSchema = z.object({
	// TODO: Add your schema properties here
	// validUrls: z.array(z.object({
	//   url: z.string(),
	//   title: z.string(),
	//   description: z.string(),
	//   channel: z.string(),
	// })),
});

/**
 * TODO Step 2: Implement the videoFinderAgent function
 *
 * This function should:
 * 1. Build a search query targeting YouTube
 * 2. Call SerpAPI to get search results
 * 3. Use Gemini to analyze and filter results
 * 4. Format and return the YouTube video links
 */
export const videoFinderAgent = async (agentAction: AgentAction) => {
	// TODO Step 2a: Build the search query
	// Use the site: operator to limit results to YouTube
	// Example: "site:youtube.com React tutorials for beginners"
	const searchQuery = `site:youtube.com ${agentAction.agentQuery}`;

	// TODO Step 2b: Call SerpAPI to search
	// Hint: Look at trendResearchAgent.ts for SerpAPI examples
	// You need to:
	// - Call getJson() from serpapi
	// - Pass api_key from process.env.SERP_API_KEY
	// - Pass the search query as 'q'
	const searchResults = null; // TODO: Replace with actual API call

	// TODO Step 2c: Extract organic results
	// The results are in searchResults.organic_results
	const organicResults = []; // TODO: Extract from searchResults

	// TODO Step 2d: Check if we got any results
	// If no results, return a helpful message
	if (organicResults.length === 0) {
		return `No YouTube videos found for: "${agentAction.agentQuery}"`;
	}

	// TODO Step 2e: Create a prompt for Gemini to analyze results
	// The prompt should ask Gemini to:
	// - Find the top 5 most relevant YouTube video URLs
	// - Look for actual video URLs (youtube.com/watch?v=...)
	// - Extract title, description, and channel for each
	const analysisPrompt = `
		TODO: Write your analysis prompt here

		Search Results:
		${JSON.stringify(organicResults, null, 2)}
	`;

	// TODO Step 2f: Call Gemini to analyze the results
	// Hint: Look at databaseSearchAgent.ts for examples
	// You need to:
	// - Call ai.models.generateContent()
	// - Use responseMimeType: 'application/json'
	// - Use responseJsonSchema with your youtubeResultsSchema
	const analysisResponse = null; // TODO: Replace with actual API call

	// TODO Step 2g: Parse the analysis response
	// Hint: Use JSON.parse() and your schema's parse() method
	const results = null; // TODO: Parse the response

	// TODO Step 2h: Format the output
	// Return a nicely formatted markdown string with:
	// - A header showing what was searched
	// - List of videos with titles, channels, descriptions
	// - Links formatted as markdown: [Title](url)
	// Example format:
	// **YouTube Videos: "React tutorials"**
	//
	// * **[Video Title](url)**
	//   Channel: Channel Name
	//   Description of the video
	return 'TODO: Format your results here';
};

/**
 * TODO Step 3: Wire up the agent (in executeAgent.ts)
 *
 * After implementing this agent, you need to:
 * 1. Add 'videoFinder' to the enum in executeAgent.ts routerSchema
 * 2. Update the prompt to describe this new agent
 * 3. Add an if/else case to call videoFinderAgent
 * 4. Update agentTypes.ts to include 'videoFinder' in the AgentAction type
 *
 * Test with queries like:
 * - "Find React tutorials for beginners"
 * - "Show me iPhone 16 review videos"
 * - "Python machine learning tutorials"
 * - "Best cooking videos for pasta carbonara"
 */

/**
 * BONUS CHALLENGES (if you finish early):
 *
 * 1. Video Duration: Extract and display video length from results
 * 2. View Counts: Show popularity indicators when available
 * 3. Content Categories: Classify videos by type (tutorial, review, entertainment)
 * 4. Channel Info: Include subscriber counts or verification status
 * 5. Playlist Detection: Identify if results include playlists vs individual videos
 */
