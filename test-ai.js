import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

console.log('API Key loaded?', process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO');

const testArticle = `
Title: OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities
Description: OpenAI has unveiled GPT-5, claiming major improvements in reasoning, coding, and multimodal understanding. The model will be available via API in Q2 2026.
URL: https://example.com/gpt5-announcement
`;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
        { 
          role: 'user', 
          content: `Summarize this tech news in Hungarian. Keep it brief (2-3 sentences) and engaging. Include the source URL at the end.

${testArticle}` 
        }
    ],
}).then(response => {
    console.log('Claude response:', response.content[0].text); 
}).catch(error => {
    console.error('Error communicating with Claude:', error);
});