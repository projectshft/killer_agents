# Student Challenge: Build a TikTok Sound Finder Agent

**Time: 1 hour**
**Difficulty: Beginner-friendly**
**Theme: Social Media & Music Campaign Management**

## What You'll Build

An AI agent that discovers organic TikToks using specific sounds. Perfect for music campaign managers who want to find influencers creating content with particular songs!

## Use Case

Music campaign managers need to:
- Discover which influencers are using a specific sound
- Find organic TikTok content featuring their artist's songs
- Identify trending videos using a particular track
- Monitor sound adoption across the platform

## Learning Objectives

By the end of this challenge, you will:
- Understand how agents work
- Define schemas with Zod
- Use SerpAPI for targeted web searches
- Use Gemini AI to analyze and filter search results
- Format and return results
- Integrate a new agent into the routing system

## Getting Started

Your template is ready at: `app/agents/soundFinderAgent.ts`

### Step-by-Step Guide

#### **Step 1: Define the Schema (10 minutes)**

Open `soundFinderAgent.ts` and complete the `tiktokResultsSchema`:

```typescript
const tiktokResultsSchema = z.object({
	validUrls: z.array(z.object({
		url: z.string(),
		title: z.string(),
		description: z.string(),
	})),
});
```

**Tip**: This schema will structure the LLM's analysis of search results.

---

#### **Step 2: Search TikTok with SerpAPI (15 minutes)**

Build the search query and call SerpAPI:

```typescript
// Use the query directly - no parsing needed!
const searchQuery = `site:tiktok.com ${agentAction.agentQuery}`;

// Search with SerpAPI
const searchResults = await getJson({
	api_key: process.env.SERP_API_KEY,
	q: searchQuery,
});

// Extract organic results
const organicResults = searchResults.organic_results || [];
```

**Tip**: The `site:` operator limits results to TikTok only! The user's query can be anything like "Espresso by Sabrina Carpenter" or "videos using APT Rose".

---

#### **Step 3: Use LLM to Analyze Results (20 minutes)**

Now use Gemini to analyze the SerpAPI results and pick out the most relevant TikTok URLs:

```typescript
// Check if we got results
if (organicResults.length === 0) {
	return `No TikTok videos found for: "${agentAction.agentQuery}"`;
}

// Create a prompt for the LLM to analyze results
const analysisPrompt = `
Analyze these TikTok search results and identify the most likely valid TikTok video URLs for: "${agentAction.agentQuery}"

Search Results:
${JSON.stringify(organicResults, null, 2)}

Pick out the top 5 most relevant TikTok video URLs. Look for:
- URLs that point to actual TikTok videos (@username/video/...)
- Content that matches the sound/song in the query
- Organic user-generated content (not official music pages)

Return a JSON object with an array of validUrls, each containing:
- url: The TikTok video URL
- title: A clean title for the video
- description: A brief description of the content
`;

// Call Gemini to analyze
const analysisResponse = await ai.models.generateContent({
	model: 'gemini-2.0-flash-exp',
	contents: analysisPrompt,
	config: {
		responseMimeType: 'application/json',
		responseJsonSchema: zodToJsonSchema(tiktokResultsSchema),
	},
});

const results = tiktokResultsSchema.parse(JSON.parse(analysisResponse.text ?? '{}'));
```

**Tip**: The LLM will filter out noise and identify the actual TikTok video URLs from the search results!

---

#### **Step 4: Format the Output (10 minutes)**

Return a nicely formatted markdown string:

```typescript
if (results.validUrls.length === 0) {
	return `No valid TikTok videos found for: "${agentAction.agentQuery}"`;
}

const formattedResults = results.validUrls
	.map((result) => {
		return `• **[${result.title}](${result.url})**\n  ${result.description}`;
	})
	.join('\n\n');

return `**TikTok Videos Using: "${agentAction.agentQuery}"**\n\n${formattedResults}\n\n*Found ${results.validUrls.length} organic TikToks using this sound*`;
```

**Tip**: Use markdown for better formatting in the UI!

---

#### **Step 5: Wire It Up (10 minutes)**

Now integrate your agent into the system:

1. **Update `executeAgent.ts`**:
   ```typescript
   // In the enum:
   .enum(['trendResearch', 'databaseSearch', 'soundFinder'])

   // In the prompt:
   - "soundFinder": For discovering organic TikToks using specific sounds/songs (useful for music campaign managers)

   // In the if/else:
   else if (nextAgent.action === 'soundFinder') {
       message = await soundFinderAgent(action);
   }
   ```

2. **Update `agentTypes.ts`**:
   ```typescript
   action: 'trendResearch' | 'databaseSearch' | 'soundFinder' | 'none';
   nextAgent?: 'trendResearch' | 'databaseSearch' | 'soundFinder';
   ```

3. **Import the agent in `executeAgent.ts`**:
   ```typescript
   import { soundFinderAgent } from './soundFinderAgent';
   ```

---

## Testing Your Agent

Try these queries:
- "Find TikToks using Espresso by Sabrina Carpenter"
- "Show me videos with APT by Rose and Bruno Mars"
- "Discover influencers using Bad Guy by Billie Eilish"
- "Videos using Blinding Lights"

## Success Criteria

Your agent should:
- [x] Search TikTok for organic content using specific sounds
- [x] Use LLM to analyze and filter search results for valid TikTok URLs
- [x] Return formatted markdown with clickable video links
- [x] Work through the main executeAgent router
- [x] Handle cases where no results are found

## Bonus Challenges

If you finish early, try adding:

1. **Influencer Metrics**: Extract follower counts or engagement indicators from results
2. **Content Categories**: Classify videos by content type (dance, lip sync, comedy, etc.)
3. **Posting Dates**: Parse and display when videos were posted
4. **Virality Indicators**: Identify videos with high view counts or shares
5. **Creator Discovery**: Build a list of influencers who frequently use the sound

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
- Real-world use case for music campaign management

**Next Steps**: Try building another agent! Ideas:
- Influencer engagement analyzer
- Viral sound predictor
- Cross-platform content tracker
- Sound performance dashboard
