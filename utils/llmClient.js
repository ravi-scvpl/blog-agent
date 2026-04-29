import Groq from "groq-sdk";

// Use llama-3.3-70b-versatile as a fast default for Groq
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Helper to call the Groq Chat API
 * @param {string} systemPrompt - Instruction for the agent
 * @param {string} userPrompt - Input to process
 * @param {boolean} jsonFormat - If true, enforces JSON output
 * @returns {Promise<string>}
 */
export const callAgent = async (systemPrompt, userPrompt, jsonFormat = false) => {
    try {
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        if (userPrompt) {
            messages.push({ role: 'user', content: userPrompt });
        }

        const requestOptions = {
            model: GROQ_MODEL,
            messages,
        };

        // For JSON output, Groq supports response_format: { type: "json_object" }
        if (jsonFormat) {
            requestOptions.response_format = { type: 'json_object' };
        }

        const chatCompletion = await groq.chat.completions.create(requestOptions);
        
        return chatCompletion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error(`Groq Error (Model: ${GROQ_MODEL}):`, error.message);
        throw error;
    }
};
