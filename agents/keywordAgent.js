import { callAgent } from '../utils/llmClient.js';

/**
 * Keyword Agent
 * Extracts primary keyword, secondary keywords, and identifies search intent.
 * 
 * @param {string} topic - The blog topic provided by the user.
 * @param {string} [userKeywords] - Optional comma-separated keywords from the user.
 * @returns {Promise<Object>} JSON containing keywords and intent.
 */
export const keywordAgent = async (topic, userKeywords) => {
    // If user provided keywords, we can skip the heavy research or use them to guide the research
    if (userKeywords && userKeywords.trim() !== "") {
        const keywordsArray = userKeywords.split(',').map(k => k.trim());
        return {
            primaryKeyword: keywordsArray[0] || topic,
            secondaryKeywords: keywordsArray.slice(1).length > 0 ? keywordsArray.slice(1) : [topic],
            intent: "Informational"
        };
    }

    const systemPrompt = `You are an expert SEO keyword researcher.
Given a blog topic, your task is to identify:
1. One primary keyword.
2. Eight secondary keywords.
3. The search intent (e.g., Informational, Transactional, Navigational).

You MUST return ONLY a valid JSON object matching the exact structure below, without markdown formatting or extra text:
{
  "primaryKeyword": "string",
  "secondaryKeywords": ["string", "string", "string", "string", "string", "string", "string", "string"],
  "intent": "string"
}`;

    const userPrompt = `Topic: "${topic}"`;

    const response = await callAgent(systemPrompt, userPrompt, true);
    
    try {
        return JSON.parse(response);
    } catch (e) {
        // Fallback robust json extraction if the model leaks text/markdown
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Failed to parse JSON from keywordAgent: " + response);
    }
};
