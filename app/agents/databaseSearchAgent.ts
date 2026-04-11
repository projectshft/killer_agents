import { AgentAction } from './agentTypes';
import { ai } from '../libs/gemini';
import { z } from 'zod';
import { prisma } from '../libs/prisma';
import { Prisma } from '@prisma/client';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * SQL AGENT ASSIGNMENT
 *
 * Your task: Build an agent that translates natural language queries
 * into Prisma database queries.
 *
 * Example queries to support:
 * - "Find fitness influencers in LA"
 * - "Show me micro tier creators under $500"
 * - "I need gaming influencers"
 *
 * The flow:
 * 1. User query comes in (natural language)
 * 2. Use Gemini to extract structured parameters (genre, tier, location, price)
 * 3. Build a Prisma WHERE clause from those parameters
 * 4. Query the database
 * 5. Format and return results
 */

// TODO 1: Define the schema for extracted query parameters
// This tells the LLM what structure to return
// Hint: You need fields for price, tier, genre, location, and maybe influencerName
const sqlSchema = z.object({
	// TODO: Add your schema fields here
	// Example: price: z.number().optional().nullable(),
});

type SqlProps = z.infer<typeof sqlSchema>;

/**
 * TODO 2: Build a Prisma WHERE clause from extracted parameters
 *
 * This function takes the structured output from the LLM and converts it
 * into a Prisma-compatible WHERE clause.
 *
 * Database structure (see prisma/schema.prisma):
 * - Influencer has: name, metadata (relation), prices (relation)
 * - InfluencerMetadata has: location, primaryGenre (relation), tier (relation)
 * - Genre has: name
 * - Tier has: name (nano, micro, mid, macro, mega)
 * - InfluencerPrice has: priceCents
 */
const constructWhereClause = (
	sqlProps: SqlProps
): Prisma.InfluencerWhereInput => {
	// TODO: Build the WHERE clause based on sqlProps
	// Hint: Check if each field exists, then add it to the clause
	//
	// Example for genre:
	// if (sqlProps.genre) {
	//   whereClause.metadata = { primaryGenre: { name: sqlProps.genre } };
	// }

	const whereClause: Prisma.InfluencerWhereInput = {};

	return whereClause;
};

/**
 * TODO 3: Implement the main agent function
 *
 * Steps:
 * 1. Get available genres from database (for context)
 * 2. Create a prompt asking Gemini to extract query parameters
 * 3. Call Gemini with structured output (JSON schema)
 * 4. Parse the response and build WHERE clause
 * 5. Query the database
 * 6. Format results as readable text
 */
export const databaseSearchAgent = async (agentAction: AgentAction) => {
	// TODO: Get unique genres from database for context
	// const uniqueGenres = await prisma.genre.findMany({ select: { name: true } });
	// const genreNames = uniqueGenres.map((g) => g.name).join(', ');

	// TODO: Create prompt for Gemini
	// Include: the user query, available genres, available tiers
	const prompt = `
Take this query: "${agentAction.agentQuery}"

TODO: Complete this prompt to extract search parameters.
Available tiers: nano, micro, mid, macro, mega
	`;

	// TODO: Call Gemini with structured output
	// const response = await ai.models.generateContent({
	//   model: 'gemini-2.5-flash',
	//   contents: prompt,
	//   config: {
	//     responseMimeType: 'application/json',
	//     responseJsonSchema: zodToJsonSchema(sqlSchema),
	//   },
	// });

	// TODO: Parse response and build WHERE clause
	// const sqlProps = sqlSchema.parse(JSON.parse(response.text || '{}'));
	// const whereClause = constructWhereClause(sqlProps);

	// TODO: Query database with WHERE clause
	// const influencers = await prisma.influencer.findMany({
	//   where: whereClause,
	//   include: {
	//     metadata: { include: { primaryGenre: true, tier: true } },
	//     prices: true,
	//   },
	//   take: 10,
	// });

	// TODO: Format and return results
	// if (influencers.length === 0) {
	//   return 'No influencers found matching your criteria.';
	// }

	return 'TODO: Implement the database search agent';
};
