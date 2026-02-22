import OpenAI from 'openai';

if (!process.env.GEMINI_API_KEY) {
	throw new Error('GEMINI_API_KEY is not set');
}

export const openai = new OpenAI({
	apiKey: process.env.GEMINI_API_KEY!,
	baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
});

export const deepseek = new OpenAI({
	apiKey: process.env.DEEPSEEK_API_KEY!,
	baseURL: 'https://api.deepseek.com/v1',
});
