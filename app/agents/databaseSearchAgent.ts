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
	rawSql?: string;
}> => {
	if (!agentAction?.agentQuery) {
		return {
			message: 'Invalid query provided',
			isDestructive: false,
			influencers: [],
		};
	}

	let uniqueGenres: Array<{ name: string }> = [];
	let tiers: Array<{ name: string }> = [];
	let locations: Array<{ location: string }> = [];

	try {
		uniqueGenres = await prisma.genre.findMany({
			select: { name: true },
		});
	} catch {
		uniqueGenres = [];
	}

	try {
		tiers = await prisma.tier.findMany({
			select: { name: true },
		});
	} catch {
		tiers = [];
	}

	try {
		locations = await prisma.influencerMetadata.findMany({
			select: { location: true },
			distinct: ['location'],
		});
	} catch {
		locations = [];
	}

	const locationList = locations
		.slice(0, 20)
		.map((l) => l.location)
		.filter(Boolean)
		.join(', ');

	const prompt = `
Extract search parameters from: "${agentAction.agentQuery}"

Genres: ${uniqueGenres.map((g) => g.name).join(', ')}
Tiers: ${tiers.map((t) => t.name).join(', ')}
Locations: ${locationList}${locations.length > 20 ? '...' : ''}

Extract: price (number), influencerName, tier, genre, location, isDestructive (true if deleting/removing).
	`;

	let sqlProps;
	try {
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
		sqlProps = sqlSchema.parse(parsed);
	} catch (error: unknown) {
		const err = error as { status?: number; message?: string };

		if (err?.status === 429 || err?.message?.includes('quota')) {
			return {
				message:
					'⚠️  Gemini API quota exceeded. Please wait a moment and try again, or upgrade your API key to a paid tier.\n\nAvailable data:\n' +
					`Genres: ${uniqueGenres.map((g) => g.name).join(', ')}\n` +
					`Tiers: ${tiers.map((t) => t.name).join(', ')}\n` +
					`Locations: ${locations
						.slice(0, 20)
						.map((l) => l.location)
						.join(', ')}`,
				isDestructive: false,
				influencers: [],
			};
		}

		sqlProps = {
			price: null,
			influencerName: null,
			tier: null,
			genre: null,
			location: null,
			isDestructive: false,
		};
	}

	const metadataWhere: Prisma.InfluencerMetadataWhereInput = {};

	if (sqlProps?.genre) {
		metadataWhere.primaryGenre = {
			name: sqlProps.genre,
		};
	}

	if (sqlProps?.location && typeof sqlProps.location === 'string') {
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

	const escapeSqlLiteral = (value: string) => value.replace(/'/g, "''");

	const rawSqlParts: string[] = [];
	rawSqlParts.push(
		'SELECT i.* FROM "Influencer" i',
		'LEFT JOIN "InfluencerMetadata" im ON im."influencerId" = i."id"',
		'LEFT JOIN "Genre" g ON g."id" = im."primaryGenreId"',
		'LEFT JOIN "Tier" t ON t."id" = im."tierId"',
	);

	const rawWhere: string[] = [];

	if (sqlProps?.genre) {
		rawWhere.push(`g."name" = '${escapeSqlLiteral(sqlProps.genre)}'`);
	}

	if (sqlProps?.location) {
		rawWhere.push(
			`im."location" = '${escapeSqlLiteral(sqlProps.location)}'`,
		);
	}

	if (sqlProps?.tier) {
		rawWhere.push(`t."name" = '${escapeSqlLiteral(sqlProps.tier)}'`);
	}

	if (sqlProps?.influencerName) {
		rawWhere.push(
			`i."name" ILIKE '%${escapeSqlLiteral(sqlProps.influencerName)}%'`,
		);
	}

	if (sqlProps?.price) {
		rawWhere.push(
			`EXISTS (SELECT 1 FROM "Price" p WHERE p."influencerId" = i."id" AND p."priceCents" <= ${Math.floor(sqlProps.price * 100)})`,
		);
	}

	if (rawWhere.length > 0) {
		rawSqlParts.push(`WHERE ${rawWhere.join(' AND ')}`);
	}

	rawSqlParts.push('LIMIT 10;');
	const rawSql = rawSqlParts.join('\n');

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
		rawSql,
	};
};
