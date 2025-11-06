export type AgentAction = {
	action: 'trendResearch' | 'databaseSearch' | 'none';
	nextAgent?: 'trendResearch' | 'databaseSearch';
	originalQuery: string;
	agentQuery: string;
};
