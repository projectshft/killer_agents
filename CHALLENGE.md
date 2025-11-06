# Challenge: Build a Hashtag Generator Agent

**Time: 1 hour**
**Difficulty: Beginner-friendly**
**Theme: Social Media & TikTok Campaigns**

## What You'll Build

An AI agent that generates creative TikTok hashtags for marketing campaigns. No prior agent experience needed!

## Learning Objectives

By the end of this challenge, you will:

-   ✅ Understand how agents work
-   ✅ Define schemas with Zod
-   ✅ Call Gemini AI for structured outputs
-   ✅ Format and return results
-   ✅ Integrate a new agent into the routing system

## Getting Started

Your template is ready at: `app/agents/hashtagGeneratorAgent.ts`

### Step-by-Step Guide

#### **Step 1: Define the Schema (10 minutes)**

Open `hashtagGeneratorAgent.ts` and complete the `hashtagSchema`:

```typescript
const hashtagSchema = z.object({
	hashtags: z.array(z.string()),
	// Bonus: Add more fields like descriptions or scores
});
```

**Tip**: Start simple! Just an array of strings is fine.

---

#### **Step 2: Build Your Prompt (15 minutes)**

Create a prompt that asks Gemini to generate hashtags:

```typescript
const prompt = `
Generate 7 creative TikTok hashtags for this campaign: "${agentAction.agentQuery}"

Return a JSON object with an array of hashtags. Mix popular and niche tags.
Examples: #FitnessChallenge, #GymTok, #HealthyLiving
`;
```

**Tip**: Look at `databaseSearchAgent.ts` for examples of good prompts!

---

#### **Step 3: Call Gemini (15 minutes)**

Use the Gemini API to generate hashtags:

```typescript
const response = await ai.models.generateContent({
	model: 'gemini-2.0-flash-exp',
	contents: prompt,
	config: {
		responseMimeType: 'application/json',
		responseJsonSchema: zodToJsonSchema(hashtagSchema),
	},
});
```

Then parse the response:

```typescript
const result = hashtagSchema.parse(JSON.parse(response.text ?? '{}'));
```

---

#### **Step 4: Format the Output (10 minutes)**

Return a nice formatted string:

```typescript
const formattedHashtags = result.hashtags.map((tag) => `• ${tag}`).join('\n');
return `📱 Suggested hashtags for your campaign:\n\n${formattedHashtags}`;
```

---

#### **Step 5: Wire It Up (10 minutes)**

Now integrate your agent into the system:

1. **Update `executeAgent.ts`**:

    ```typescript
    // In the enum:
    .enum(['trendResearch', 'databaseSearch', 'hashtagGenerator'])

    // In the prompt:
    - "hashtagGenerator": For generating TikTok hashtags for campaigns

    // In the if/else:
    else if (nextAgent.action === 'hashtagGenerator') {
        message = await hashtagGeneratorAgent(action);
    }
    ```

2. **Update `agentTypes.ts`**:
    ```typescript
    action: 'trendResearch' | 'databaseSearch' | 'hashtagGenerator' | 'none';
    nextAgent?: 'trendResearch' | 'databaseSearch' | 'hashtagGenerator';
    ```

---

## Testing Your Agent

Try these queries:

-   ✅ "Generate hashtags for a beauty campaign"
-   ✅ "I need hashtags for gaming content"
-   ✅ "Create hashtags for a fitness challenge"
-   ✅ "Hashtags for a Gen Z dance trend"

## Success Criteria

Your agent should:

-   [x] Generate 5-10 relevant hashtags
-   [x] Return formatted text output
-   [x] Work through the main executeAgent router
-   [x] Handle the query appropriately

## Bonus Challenges

If you finish early, try adding:

1. **Trending Scores**: Rate each hashtag 1-10 for potential reach
2. **Categories**: Group hashtags (broad vs niche)
3. **Character Counter**: Show total characters for caption planning
4. **Hashtag Combos**: Suggest which hashtags work well together
5. **Emoji Support**: Add relevant emojis to hashtags

## Need Help?

**Reference Files:**

-   `databaseSearchAgent.ts` - Example of database queries
-   `trendResearchAgent.ts` - Example of external API + AI
-   `executeAgent.ts` - Routing logic

**Common Issues:**

-   "Schema parse error" → Check your JSON structure matches the schema
-   "Agent not called" → Make sure you updated executeAgent.ts and agentTypes.ts
-   "No results" → Check your prompt is clear and specific

## What You've Learned

Congratulations! You now understand:

-   🎯 How agents receive and process requests
-   🎯 How to use schemas for structured AI outputs
-   🎯 How agents fit into a larger routing system
-   🎯 How to format results for end users

**Next Steps**: Try building another agent! Ideas:

-   Caption generator
-   Best posting time suggester
-   Influencer comparison tool
