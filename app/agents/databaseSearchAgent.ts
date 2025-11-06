import { AgentAction } from './agentTypes';
import { ai } from '../libs/gemini';
import { z } from 'zod';
import { prisma } from '../libs/prisma';
import { Prisma } from '@prisma/client';
import { zodToJsonSchema } from 'zod-to-json-schema';

//TODO - add gender to the database and add as context

const sqlSchema = z.object({
	price: z.number().optional().nullable(),
	influencerName: z.string().optional().nullable(),
	tier: z.string().optional().nullable(),
	genre: z.string().optional().nullable(),
	location: z.string().optional().nullable(),
});

export const databaseSearchAgent = async (agentAction: AgentAction) => {
	const uniqueGenres = await prisma.genre.findMany({
		select: { name: true },
	});

	const genreNames = uniqueGenres.map((g) => g.name).join(', ');

	const prompt = `
Take this query: "${agentAction.agentQuery}"

Extract the properties to use in a database search query.

Available genres: ${genreNames}
Available tiers: nano, micro, mid, macro, mega

Extract:
- price: if mentioned (as a number, not string)
- influencerName: if looking for a specific influencer
- tier: if mentioned (nano, micro, mid, macro, mega)
- genre: if mentioned (must match one from the list)
	`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.0-flash-exp',
		contents: prompt,
		config: {
			responseMimeType: 'application/json',
			responseJsonSchema: zodToJsonSchema(sqlSchema),
		},
	});

	const responseText = response.text || '{}';
	console.log('Database Search Agent - Raw response:', responseText);
	const sqlProps = sqlSchema.parse(JSON.parse(responseText));
	console.log('Database Search Agent - Parsed:', sqlProps);

	const metadataWhere: Prisma.InfluencerMetadataWhereInput = {};

	if (sqlProps?.genre) {
		metadataWhere.primaryGenre = {
			name: sqlProps.genre,
		};
	}

	if (sqlProps?.location) {
		metadataWhere.location = sqlProps.location;
	}

	if (sqlProps?.tier) {
		metadataWhere.tier = {
			name: sqlProps.tier,
		};
	}

	const whereClause: Prisma.InfluencerWhereInput = {};

	if (Object.keys(metadataWhere).length > 0) {
		whereClause.metadata = metadataWhere;
	}

	if (sqlProps?.influencerName) {
		whereClause.name = {
			contains: sqlProps.influencerName,
			mode: 'insensitive',
		};
	}

	if (sqlProps?.price) {
		whereClause.prices = {
			some: {
				priceCents: {
					lte: sqlProps.price * 100,
				},
			},
		};
	}

	const influencers = await prisma.influencer.findMany({
		where: whereClause,
		include: {
			metadata: {
				include: {
					primaryGenre: true,
					tier: true,
				},
			},
			prices: true,
		},
		take: 10, // Limit to 10 results
	});

	// Format results as text
	if (influencers.length === 0) {
		return 'No influencers found matching your criteria.';
	}

	const results = influencers.map((inf) => {
		const minPrice =
			inf.prices.length > 0
				? Math.min(...inf.prices.map((p) => p.priceCents))
				: 0;
		const priceStr =
			minPrice > 0 ? `$${(minPrice / 100).toFixed(2)}` : 'N/A';

		return `• ${inf.name} - ${inf.metadata?.tier.name} tier, ${inf.metadata?.primaryGenre.name} genre, ${inf.metadata?.location}. Starting price: ${priceStr}`;
	});

	return `Found ${influencers.length} influencers:\n\n${results.join('\n')}`;
};
