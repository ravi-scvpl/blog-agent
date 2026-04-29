import express from 'express';
import { keywordAgent } from '../agents/keywordAgent.js';
import { contentAgent } from '../agents/contentAgent.js';
import { enhanceAgent } from '../agents/enhanceAgent.js';
import { humanizeAgent } from '../agents/humanizeAgent.js';
import { seoAgent } from '../agents/seoAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { topic, userKeywords } = req.body;
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        console.log(`[1/5] Starting Keyword Agent for topic: "${topic}"...`);
        const keywords = await keywordAgent(topic, userKeywords);

        console.log(`[2/5] Starting Content Agent...`);
        const draft = await contentAgent(keywords);

        console.log(`[3/5] Starting Enhancement Agent...`);
        const improved = await enhanceAgent(draft);

        console.log(`[4/5] Starting Humanization Agent...`);
        const humanized = await humanizeAgent(improved);

        console.log(`[5/5] Starting SEO Agent...`);
        const seoBlog = await seoAgent(humanized, keywords);

        console.log(`[SUCCESS] Blog pipeline complete!`);
        res.json(seoBlog);
    } catch (error) {
        console.error("Pipeline Error:", error);
        res.status(500).json({ error: "Internal Server Error during blog generation", details: error.message });
    }
});

export default router;
