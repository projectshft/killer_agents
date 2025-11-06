import { AgentAction } from './agentTypes';
import { ai } from '../libs/gemini';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getJson } from 'serpapi';

/**
 * STUDENT CHALLENGE: TikTok Sound Finder Agent
 *
 * Goal: Build an agent that finds TikTok music/sound links for specific songs
 *
 * This agent should:
 * 1. Extract track name and artist from the query
 * 2. Search TikTok for that specific song using SerpAPI
 * 3. Return TikTok music page links
 */

// TODO Step 1: Define the schema for extracting song information
// What should the AI extract from the user query?
// Hint: You need trackName and artistName
const songSchema = z.object({
	// TODO: Add your schema properties here
	// Example: trackName: z.string()
	// Example: artistName: z.string()
});

/**
 * TODO Step 2: Implement the soundFinderAgent function
 *
 * This function should:
 * 1. Extract track name and artist from the user query using Gemini
 * 2. Build a SerpAPI search query: "site:tiktok.com/music {trackName} {artistName}"
 * 3. Search with SerpAPI
 * 4. Format and return the TikTok music links
 */
export const soundFinderAgent = async (agentAction: AgentAction) => {
	// TODO Step 2a: Create a prompt to extract song info from the query
	// The prompt should:
	// - Ask Gemini to extract the track name and artist
	// - Handle queries like "Find the TikTok sound for Blinding Lights by The Weeknd"
	const extractionPrompt = `
		TODO: Write your prompt here
		User query: ${agentAction.agentQuery}
	`;

	// TODO Step 2b: Call Gemini to extract song information
	// Hint: Look at databaseSearchAgent.ts for examples
	// You need to:
	// - Call ai.models.generateContent()
	// - Use responseMimeType: 'application/json'
	// - Use responseJsonSchema with your songSchema
	const extractionResponse = null; // TODO: Replace with actual API call

	// TODO Step 2c: Parse the extraction response
	// Hint: Use JSON.parse() and your schema's parse() method
	const songInfo = null; // TODO: Parse the response

	// TODO Step 2d: Build the search query for SerpAPI
	// Format: "site:tiktok.com/music {trackName} {artistName}"
	// Example: "site:tiktok.com/music Blinding Lights The Weeknd"
	const searchQuery = 'TODO: Build search query';

	// TODO Step 2e: Call SerpAPI to search for the song
	// Hint: Look at trendResearchAgent.ts for SerpAPI examples
	// You need to:
	// - Call getJson() from serpapi
	// - Pass api_key from process.env.SERP_API_KEY
	// - Pass the search query
	const searchResults = null; // TODO: Replace with actual API call

	// TODO Step 2f: Extract organic results
	// The results are in searchResults.organic_results
	// Each result has: title, link, snippet
	const organicResults = []; // TODO: Extract from searchResults

	// TODO Step 2g: Format the output
	// Return a nicely formatted string with:
	// - The song name and artist
	// - List of TikTok music links
	// - Snippets/descriptions for each link
	// Example format:
	// 🎵 TikTok Sounds for "Blinding Lights" by The Weeknd
	//
	// • [Link] Title - snippet
	// • [Link] Title - snippet
	return 'TODO: Format your results here';
};

/**
 * TODO Step 3: Wire up the agent (in executeAgent.ts)
 *
 * After implementing this agent, you need to:
 * 1. Add 'soundFinder' to the enum in executeAgent.ts routerSchema
 * 2. Update the prompt to describe this new agent
 * 3. Add an if/else case to call soundFinderAgent
 * 4. Update agentTypes.ts to include 'soundFinder' in the AgentAction type
 *
 * Test with queries like:
 * - "Find the TikTok sound for Espresso by Sabrina Carpenter"
 * - "Get me the TikTok music link for APT by Rose and Bruno Mars"
 * - "Search TikTok for the song Bad Guy by Billie Eilish"
 */

/**
 * BONUS CHALLENGES (if you finish early):
 *
 * 1. View Count: Show view counts for each sound if available
 * 2. Sound Popularity: Indicate which link has the most engagement
 * 3. Related Sounds: Suggest similar or remix versions of the song
 * 4. Sound Preview: Include preview URLs if available in the search results
 * 5. Multiple Versions: Handle cases where there are multiple versions (original, sped up, slowed + reverb)
 */
