import { callAgent } from '../utils/llmClient.js';

/**
 * SEO Agent
 * Adds meta title, meta description, optimizations.
 * 
 * @param {string} finalDraft - The humanized markdown.
 * @param {Object} keywords - The initially extracted keywords.
 * @returns {Promise<Object>} JSON containing the final blog and SEO metadata.
 */
export const seoAgent = async (finalDraft, keywords) => {
    const systemPrompt = `You are a technical SEO specialist.
Given a final blog draft and its keywords, construct the final metadata.
You MUST return ONLY a JSON object (no markdown wrapping, no extra text) with the following structure:
{
  "metaTitle": "string (max 60 chars)",
  "metaDescription": "string (max 160 chars)",
  "slug": "string-url-format"
}`;

    const userPrompt = `Keywords Data:
${JSON.stringify(keywords, null, 2)}

Blog Draft:
${finalDraft}`;

    const response = await callAgent(systemPrompt, userPrompt, true);

    let parsedData = {};
    try {
        parsedData = JSON.parse(response);
    } catch (e) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error("Failed to parse JSON from seoAgent: " + response);
        }
    }
    
    // Inject the final blog back into the payload so the frontend can display it
    parsedData.finalBlog = finalDraft;
    return parsedData;
};
