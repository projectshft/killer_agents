export type AgentAction = {
	action: 'databaseSearch';
	nextAgent?: 'databaseSearch';
	originalQuery: string;
	agentQuery: string;
};
