'use server';

import { executeAgent as execute } from './agents/executeAgent';

export async function executeAgent(query: string) {
	const result = await execute(query);
	console.log('Action - Result:', result);
	return result;
}
