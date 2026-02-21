'use server';

import { AgentAction } from './agentTypes';
import { ai } from '../libs/gemini';
import { z } from 'zod';
import { prisma } from '../libs/prisma';
import { Influencer, Prisma } from '@prisma/client';
import { zodToJsonSchema } from 'zod-to-json-schema';

const sqlSchema = z.object({
	price: z.number().optional().nullable(),
	influencerName: z.string().optional().nullable(),
	tier: z.string().optional().nullable(),
	genre: z.string().optional().nullable(),
	location: z.string().optional().nullable(),
	isDestructive: z
		.boolean()
		.optional()
		.nullable()
		.describe(
			'if the query is about deleting, removing, or cleaning up influencers, set to true',
		),
});

export const databaseSearchAgent = async (
	agentAction: AgentAction,
): Promise<{
	message: string;
	isDestructive: boolean;
	influencers?: Influencer[];
}> => {
	const [uniqueGenres, tiers, locations] = await Promise.all([
		prisma.genre
			.findMany({
				select: { name: true },
			})
			.catch(() => [] as Array<{ name: string }>),
		prisma.tier
			.findMany({
				select: { name: true },
			})
			.catch(() => [] as Array<{ name: string }>),
		prisma.influencerMetadata
			.findMany({
				select: { location: true },
				distinct: ['location'],
			})
			.catch(() => [] as Array<{ location: string }>),
	]);

	const locationList = locations
		.slice(0, 20)
		.map((l) => l.location)
		.filter(Boolean)
		.join(', ');

	const prompt = `
		Extract search parameters from: "${agentAction.agentQuery}"

		Genres: ${uniqueGenres.map((g) => g.name).join(', ')}
		Tiers: ${tiers.map((t) => t.name).join(', ')}
		Locations (examples): ${locationList}${locations.length > 20 ? '...' : ''}

		Extract: price (number), influencerName, tier, genre, location, isDestructive (true if deleting/removing).
		For location, return the location text from the user query (city, state, or country), not only exact full DB values.
	`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: prompt,
		config: {
			responseMimeType: 'application/json',
			responseJsonSchema: zodToJsonSchema(sqlSchema),
		},
	});

	const responseText = response.text || '{}';
	const parsed = JSON.parse(responseText);
	const sqlProps = sqlSchema.parse(parsed);

	const metadataWhere: Prisma.InfluencerMetadataWhereInput = {};

	if (sqlProps?.genre) {
		metadataWhere.primaryGenre = {
			name: sqlProps.genre,
		};
	}

	if (sqlProps?.location) {
		metadataWhere.location = {
			contains: sqlProps.location.trim(),
		};
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
		take: 10,
	});

	const results = influencers.map((inf) => {
		const minPrice =
			inf.prices.length > 0
				? Math.min(...inf.prices.map((p) => p.priceCents))
				: 0;
		const priceStr =
			minPrice > 0 ? `$${(minPrice / 100).toFixed(2)}` : 'N/A';

		const tierName = inf.metadata?.tier?.name || 'Unknown';
		const genreName = inf.metadata?.primaryGenre?.name || 'Unknown';
		const location = inf.metadata?.location || 'Unknown';

		return `• ${inf.name} - ${tierName} tier, ${genreName} genre, ${location}. Starting price: ${priceStr}`;
	});

	return {
		message: `Found ${influencers.length} influencers:\n\n${results.join('\n')}`,
		isDestructive: sqlProps?.isDestructive ?? false,
		influencers,
	};
};
