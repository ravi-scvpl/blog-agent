import { callAgent } from '../utils/llmClient.js';

/**
 * Enhancement Agent
 * Improves readability, removes fluff, and adds formatting/examples.
 * 
 * @param {string} draft - The markdown drafted by the content agent.
 * @returns {Promise<string>} The enhanced markdown.
 */
export const enhanceAgent = async (draft) => {
    const systemPrompt = `You are a world-class editor and content strategist.
Take the following long-form blog draft and enhance it for depth and relatability.
Your tasks:
- Improve readability while maintaining a natural, conversational flow.
- Ensure every section is detailed and well-explained; add depth where it feels thin.
- Weave in relatable analogies, real-world examples, or "human-like" insights to make the content resonate.
- Ensure lists and formatting emphasize the main points without breaking the narrative.
Keep the overall markdown structure but make the writing significantly more authoritative yet approachable. Do not wrap in markdown \`\`\` codeblocks.`;

    const userPrompt = `${draft}`;

    const enhanced = await callAgent(systemPrompt, userPrompt, false);
    return enhanced;
};
