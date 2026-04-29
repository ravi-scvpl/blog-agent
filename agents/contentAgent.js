import { callAgent } from '../utils/llmClient.js';

/**
 * Content Agent
 * Generates a structured blog (H1, H2, H3, intro, body, FAQ).
 * 
 * @param {Object} keywordData - Output from keywordAgent.
 * @returns {Promise<string>} The generated article in Markdown.
 */
export const contentAgent = async (keywordData) => {
    const systemPrompt = `You are an elite, down-to-earth copywriter who writes friendly, easy-to-understand, and professional articles.
Your goal is to write an authentic, human-sounding blog post that avoids sounding like AI or a corporate press release.

Rules for Writing:
1. AUTHENTIC FLOW: Avoid a rigid, mechanical structure. Let the story flow naturally and authentically, as if sharing expert advice with a friend.
2. TONE & STYLE: Use everyday language, real-world examples, and relatable analogies. Be professional but down-to-earth.
3. DEPTH & LENGTH: Aim for at least 1500-2000 words of high-quality content. Do not just list facts; explain the "why" and "how" with depth.
4. KEYWORD INTEGRATION: Naturally weave the primary and secondary keywords into the text. Aim for high keyword prominence and density (roughly every 100 words) without being repetitive or "spammy".
5. STRUCTURE:
   - Catchy, benefit-driven H1 Title.
   - Engaging introduction using a relatable hook or story.
   - Use H2 and H3 subheadings where they feel natural to the flow, not just as placeholders.
   - Thoughtful, action-oriented conclusion.
   - Exactly 7 unique and highly relevant FAQs at the end.

Ensure the content is emotionally resonant and high on relatability.
Output the blog strictly in Markdown format. Do not wrap the response in a codeblock (\`\`\`), just return the raw markdown.`;

    const userPrompt = `Primary Keyword: ${keywordData.primaryKeyword}
Secondary Keywords: ${keywordData.secondaryKeywords.join(', ')}
Search Intent: ${keywordData.intent}

Please write the full markdown draft now.`;

    const draft = await callAgent(systemPrompt, userPrompt, false);
    return draft;
};
