'use server';

import { prisma } from '../libs/prisma';
import { Influencer } from '@prisma/client';

export async function deleteInfluencersAction(
	influencers: Influencer[],
): Promise<number> {
	const deletedInfluencers = await prisma.influencer.deleteMany({
		where: {
			id: { in: influencers.map((influencer) => influencer.id) },
		},
	});
	return deletedInfluencers.count;
}
