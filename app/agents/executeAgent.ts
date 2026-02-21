'use server';

import { AgentAction } from './agentTypes';
import { databaseSearchAgent } from './databaseSearchAgent';
import { Influencer } from '@prisma/client';

export type ExecuteAgentResult = {
	agent: string;
	message: string;
	isDestructive?: boolean;
	influencers?: Influencer[];
};

export async function executeAgent(query: string): Promise<ExecuteAgentResult> {
	console.log('[executeAgent] Received query:', query);
	
	const action: AgentAction = {
		action: 'databaseSearch',
		agentQuery: query,
		originalQuery: query,
	};

	console.log('[executeAgent] Routing to databaseSearchAgent');
	const agentResult = await databaseSearchAgent(action);

	const result = {
		agent: 'databaseSearchAgent',
		...agentResult,
	};
	
	console.log('[executeAgent] Returning result:', {
		agent: result.agent,
		resultCount: result.influencers?.length || 0,
		isDestructive: result.isDestructive,
	});
	
	return result;
}
