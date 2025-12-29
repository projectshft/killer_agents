# Student Challenge: Build a YouTube Video Finder Agent

**Difficulty: Beginner-friendly**
**Theme: Content Discovery & Research**

## What You'll Build

An AI agent that discovers YouTube videos on any topic. Perfect for content creators, marketers, and researchers who want to find relevant video content!

## Use Case

Content professionals need to:
- Find videos on specific topics for research
- Discover influencer content about products or brands
- Locate educational tutorials and how-to guides
- Research what video content exists before creating their own

## Learning Objectives

By the end of this challenge, you will:
- Understand how agents work
- Define schemas with Zod
- Use SerpAPI for targeted web searches
- Use Gemini AI to analyze and filter search results
- Format and return results
- Integrate a new agent into the routing system

## Getting Started

Your template is ready at: `app/agents/videoFinderAgent.ts`

### Step-by-Step Guide

#### **Step 1: Define the Schema**

Open `videoFinderAgent.ts` and complete the `youtubeResultsSchema`:

```typescript
const youtubeResultsSchema = z.object({
	validUrls: z.array(z.object({
		url: z.string(),
		title: z.string(),
		description: z.string(),
		channel: z.string(),
	})),
});
```

**Tip**: This schema will structure the LLM's analysis of search results. The `channel` field helps identify who created the video.

---

#### **Step 2: Search YouTube with SerpAPI**

Build the search query and call SerpAPI:

```typescript
// Use the query directly - no parsing needed!
const searchQuery = `site:youtube.com ${agentAction.agentQuery}`;

// Search with SerpAPI
const searchResults = await getJson({
	api_key: process.env.SERP_API_KEY,
	q: searchQuery,
});

// Extract organic results
const organicResults = searchResults.organic_results || [];
```

**Tip**: The `site:` operator limits results to YouTube only! The user's query can be anything like "React tutorials for beginners" or "best budget laptops 2024".

---

#### **Step 3: Use LLM to Analyze Results**

Now use Gemini to analyze the SerpAPI results and pick out the most relevant YouTube URLs:

```typescript
// Check if we got results
if (organicResults.length === 0) {
	return `No YouTube videos found for: "${agentAction.agentQuery}"`;
}

// Create a prompt for the LLM to analyze results
const analysisPrompt = `
Analyze these YouTube search results and identify the most relevant video URLs for: "${agentAction.agentQuery}"

Search Results:
${JSON.stringify(organicResults, null, 2)}

Pick out the top 5 most relevant YouTube video URLs. Look for:
- URLs that point to actual YouTube videos (youtube.com/watch?v=...)
- Content that directly matches the search query
- Videos from reputable channels when possible

Return a JSON object with an array of validUrls, each containing:
- url: The YouTube video URL
- title: The video title
- description: A brief description of what the video covers
- channel: The channel name (if available, otherwise "Unknown")
`;

// Call Gemini to analyze
const analysisResponse = await ai.models.generateContent({
	model: 'gemini-2.0-flash-exp',
	contents: analysisPrompt,
	config: {
		responseMimeType: 'application/json',
		responseJsonSchema: zodToJsonSchema(youtubeResultsSchema),
	},
});

const results = youtubeResultsSchema.parse(JSON.parse(analysisResponse.text ?? '{}'));
```

**Tip**: The LLM will filter out noise and identify the actual YouTube video URLs from the search results!

---

#### **Step 4: Format the Output**

Return a nicely formatted markdown string:

```typescript
if (results.validUrls.length === 0) {
	return `No valid YouTube videos found for: "${agentAction.agentQuery}"`;
}

const formattedResults = results.validUrls
	.map((result) => {
		return `• **[${result.title}](${result.url})**\n  Channel: ${result.channel}\n  ${result.description}`;
	})
	.join('\n\n');

return `**YouTube Videos: "${agentAction.agentQuery}"**\n\n${formattedResults}\n\n*Found ${results.validUrls.length} relevant videos*`;
```

**Tip**: Use markdown for better formatting in the UI!

---

#### **Step 5: Wire It Up**

Now integrate your agent into the system:

1. **Update `executeAgent.ts`**:
   ```typescript
   // In the enum:
   .enum(['trendResearch', 'databaseSearch', 'videoFinder'])

   // In the prompt:
   - "videoFinder": For discovering YouTube videos on any topic (tutorials, reviews, educational content)

   // In the if/else:
   else if (nextAgent.action === 'videoFinder') {
       message = await videoFinderAgent(action);
   }
   ```

2. **Update `agentTypes.ts`**:
   ```typescript
   action: 'trendResearch' | 'databaseSearch' | 'videoFinder' | 'none';
   nextAgent?: 'trendResearch' | 'databaseSearch' | 'videoFinder';
   ```

3. **Import the agent in `executeAgent.ts`**:
   ```typescript
   import { videoFinderAgent } from './videoFinderAgent';
   ```

---

## Testing Your Agent

Try these queries:
- "Find React tutorials for beginners"
- "Show me iPhone 16 review videos"
- "Python machine learning tutorials"
- "Best cooking videos for pasta carbonara"
- "How to build a website from scratch"

## Success Criteria

Your agent should:
- [x] Search YouTube for videos matching the user's query
- [x] Use LLM to analyze and filter search results for valid YouTube URLs
- [x] Return formatted markdown with clickable video links
- [x] Work through the main executeAgent router
- [x] Handle cases where no results are found

## Bonus Challenges

If you finish early, try adding:

1. **Video Duration**: Extract and display video length from results
2. **View Counts**: Show popularity indicators when available
3. **Content Categories**: Classify videos by type (tutorial, review, entertainment, etc.)
4. **Channel Info**: Include subscriber counts or channel verification status
5. **Playlist Detection**: Identify if results include playlists vs individual videos

## Need Help?

**Reference Files:**
- `databaseSearchAgent.ts` - Example of using Gemini with structured outputs
- `trendResearchAgent.ts` - Example of using SerpAPI
- `executeAgent.ts` - Routing logic

**Common Issues:**
- "Schema parse error" → Check your JSON structure matches the schema
- "Agent not called" → Make sure you updated executeAgent.ts and agentTypes.ts
- "No results" → Check your search query format and SerpAPI key
- "Invalid API key" → Verify SERP_API_KEY in your .env file
- "LLM returns empty results" → Improve your analysis prompt to be more specific

## What You've Learned

Congratulations! You now understand:
- How to combine search APIs with LLM analysis
- How to use AI to filter and extract relevant information from raw data
- How to build targeted search queries for specific platforms
- How to structure LLM outputs for consistent results
- How agents fit into a larger routing system
- Real-world use case for content discovery and research

**Next Steps**: Try building another agent! Ideas:
- Product review aggregator
- News article finder
- Documentation search helper
- Social media content tracker
