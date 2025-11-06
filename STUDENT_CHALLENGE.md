# Student Challenge: Build a TikTok Sound Finder Agent

**Time: 1 hour**
**Difficulty: Beginner-friendly**
**Theme: Social Media & TikTok Campaigns**

## What You'll Build

An AI agent that finds TikTok music/sound links for specific songs. Perfect for influencers who need to find the right sound URL for their content!

## Learning Objectives

By the end of this challenge, you will:
- ✅ Understand how agents work
- ✅ Define schemas with Zod
- ✅ Call Gemini AI for structured outputs
- ✅ Use SerpAPI for targeted web searches
- ✅ Format and return results
- ✅ Integrate a new agent into the routing system

## Getting Started

Your template is ready at: `app/agents/soundFinderAgent.ts`

### Step-by-Step Guide

#### **Step 1: Define the Schema (10 minutes)**

Open `soundFinderAgent.ts` and complete the `songSchema`:

```typescript
const songSchema = z.object({
	trackName: z.string(),
	artistName: z.string(),
});
```

**Tip**: This schema will help Gemini extract the song details from the user's query.

---

#### **Step 2: Extract Song Info with Gemini (15 minutes)**

Create a prompt that asks Gemini to extract the track name and artist:

```typescript
const extractionPrompt = `
Extract the track name and artist from this query: "${agentAction.agentQuery}"

Return a JSON object with trackName and artistName.

Examples:
- "Find the TikTok sound for Espresso by Sabrina Carpenter" → {"trackName": "Espresso", "artistName": "Sabrina Carpenter"}
- "Get me APT by Rose" → {"trackName": "APT", "artistName": "Rose"}
`;
```

Then call Gemini:

```typescript
const extractionResponse = await ai.models.generateContent({
	model: 'gemini-2.0-flash-exp',
	contents: extractionPrompt,
	config: {
		responseMimeType: 'application/json',
		responseJsonSchema: zodToJsonSchema(songSchema),
	},
});

const songInfo = songSchema.parse(JSON.parse(extractionResponse.text ?? '{}'));
```

**Tip**: Look at `databaseSearchAgent.ts` for examples!

---

#### **Step 3: Search TikTok with SerpAPI (15 minutes)**

Build the search query and call SerpAPI:

```typescript
// Build the search query
const searchQuery = `site:tiktok.com/music ${songInfo.trackName} ${songInfo.artistName}`;

// Search with SerpAPI
const searchResults = await getJson({
	api_key: process.env.SERP_API_KEY,
	q: searchQuery,
});

// Extract organic results
const organicResults = searchResults.organic_results || [];
```

**Tip**: The `site:` operator limits results to TikTok's music pages only!

---

#### **Step 4: Format the Output (10 minutes)**

Return a nicely formatted markdown string:

```typescript
if (organicResults.length === 0) {
	return `No TikTok sounds found for "${songInfo.trackName}" by ${songInfo.artistName}`;
}

const formattedResults = organicResults
	.slice(0, 5) // Limit to top 5 results
	.map((result: any) => {
		return `• **[${result.title}](${result.link})**\n  ${result.snippet || 'No description available'}`;
	})
	.join('\n\n');

return `🎵 **TikTok Sounds for "${songInfo.trackName}" by ${songInfo.artistName}**\n\n${formattedResults}`;
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
   - "soundFinder": For finding TikTok music/sound links for specific songs

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
- ✅ "Find the TikTok sound for Espresso by Sabrina Carpenter"
- ✅ "Get me the TikTok music link for APT by Rose and Bruno Mars"
- ✅ "Search TikTok for the song Bad Guy by Billie Eilish"
- ✅ "I need the TikTok sound for Blinding Lights"

## Success Criteria

Your agent should:
- [x] Extract track name and artist from queries
- [x] Search TikTok music pages using SerpAPI
- [x] Return formatted markdown with clickable links
- [x] Work through the main executeAgent router
- [x] Handle cases where no results are found

## Bonus Challenges

If you finish early, try adding:

1. **View Count Detection**: Parse and display view counts if available in search results
2. **Sound Popularity**: Rank results by engagement or popularity indicators
3. **Multiple Versions**: Detect and display different versions (original, sped up, slowed + reverb)
4. **Sound Metadata**: Extract additional info like duration, upload date, or creator
5. **Related Sounds**: Suggest similar or trending sounds in the same genre

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

## What You've Learned

Congratulations! You now understand:
- 🎯 How to use AI for information extraction
- 🎯 How to combine AI with external APIs (SerpAPI)
- 🎯 How to build targeted search queries with operators
- 🎯 How to format results with markdown for better UX
- 🎯 How agents fit into a larger routing system

**Next Steps**: Try building another agent! Ideas:
- Caption generator for TikTok videos
- Best posting time suggester based on audience analytics
- Trending sound detector
- Influencer comparison tool
