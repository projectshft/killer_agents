import OpenAI from 'openai';

if (!process.env.GEMINI_API_KEY) {
	throw new Error('GEMINI_API_KEY is not set');
}

export const openai = new OpenAI({
	apiKey: process.env.GEMINI_API_KEY!,
	baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
});
