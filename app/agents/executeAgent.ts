import { AgentAction } from './agentTypes';
import { databaseSearchAgent } from './databaseSearchAgent';

/**
 * Simple agent executor that routes all queries to the database search agent.
 *
 * In a more complex system, you'd have a router that decides which agent to use.
 * For this assignment, we're focused on the database search functionality.
 */
export async function executeAgent(query: string) {
	const action: AgentAction = {
		action: 'databaseSearch',
		agentQuery: query,
		originalQuery: query,
	};

	const message = await databaseSearchAgent(action);

	return { agent: 'databaseSearch', message };
}
